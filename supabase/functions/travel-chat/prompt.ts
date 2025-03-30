
// Extract travel preferences from user messages
export function extractTravelPreferences(chatHistory: any[]) {
  try {
    // Look for preferences in previous messages
    const preferences = {
      budget: null, // "low", "medium", "high"
      region: null, // "Asia", "Europe", etc.
      interests: [], // ["beaches", "hiking", "culture", etc.]
      duration: null, // "weekend", "week", "month"
      climate: null, // "warm", "cold", "tropical"
      travelWith: null, // "solo", "family", "couple"
    };
    
    // Simple keyword matching for demonstration
    // In a production app, you might use more sophisticated NLP
    const userMessages = chatHistory.filter(msg => msg.role === 'user').map(msg => msg.content.toLowerCase());
    
    userMessages.forEach(msg => {
      // Budget detection
      if (msg.includes('cheap') || msg.includes('affordable') || msg.includes('budget friendly')) {
        preferences.budget = 'low';
      } else if (msg.includes('luxury') || msg.includes('expensive')) {
        preferences.budget = 'high';
      }
      
      // Region detection
      const regions = ['asia', 'europe', 'africa', 'north america', 'south america', 'australia', 'antarctica'];
      regions.forEach(region => {
        if (msg.includes(region)) {
          preferences.region = region;
        }
      });
      
      // Interests detection
      const interests = ['beach', 'hiking', 'culture', 'food', 'history', 'nature', 'adventure', 'relaxation', 'shopping'];
      interests.forEach(interest => {
        if (msg.includes(interest) && !preferences.interests.includes(interest)) {
          preferences.interests.push(interest);
        }
      });
      
      // Duration detection 
      if (msg.includes('weekend') || msg.includes('few days')) {
        preferences.duration = 'weekend';
      } else if (msg.includes('week') || msg.includes('7 days')) {
        preferences.duration = 'week';
      } else if (msg.includes('month') || msg.includes('long trip')) {
        preferences.duration = 'month';
      }
      
      // Climate detection
      if (msg.includes('warm') || msg.includes('hot') || msg.includes('sunshine')) {
        preferences.climate = 'warm';
      } else if (msg.includes('cold') || msg.includes('snow') || msg.includes('winter')) {
        preferences.climate = 'cold';
      } else if (msg.includes('tropical') || msg.includes('humid')) {
        preferences.climate = 'tropical';
      }
      
      // Travel companions
      if (msg.includes('solo') || msg.includes('myself') || msg.includes('alone')) {
        preferences.travelWith = 'solo';
      } else if (msg.includes('family') || msg.includes('kids') || msg.includes('children')) {
        preferences.travelWith = 'family';
      } else if (msg.includes('couple') || msg.includes('partner') || msg.includes('romantic')) {
        preferences.travelWith = 'couple';
      }
    });
    
    return preferences;
  } catch (error) {
    console.error('Error extracting preferences:', error);
    return {};
  }
}

// Format travel documents for RAG context
function formatDocumentsForRAG(relevantDocs: any[], isFollowUp = false) {
  if (!relevantDocs || relevantDocs.length === 0) {
    return "I don't have specific information about this destination in my knowledge base, but I can provide general travel advice based on my training.";
  }
  
  // Sort documents by similarity score if available
  const sortedDocs = [...relevantDocs].sort((a, b) => 
    (b.similarity || 0) - (a.similarity || 0)
  );
  
  // For follow-up questions, be more concise with the context
  const docsToInclude = isFollowUp ? sortedDocs.slice(0, 2) : sortedDocs;
  
  let ragContext = "Here is detailed information about travel destinations that might be relevant to the user's query:\n\n";
  
  docsToInclude.forEach((doc, index) => {
    ragContext += `[Source ${index + 1}: ${doc.destination_name}]\n`;
    
    // For follow-up questions, include shorter excerpts
    if (isFollowUp) {
      // Extract the most relevant sections (first 2 paragraphs)
      const paragraphs = doc.content.split('\n\n');
      const excerpts = paragraphs.slice(0, 2).join('\n\n');
      ragContext += `${excerpts}\n\n`;
    } else {
      ragContext += `${doc.content}\n\n`;
    }
  });
  
  if (isFollowUp && sortedDocs.length > 2) {
    ragContext += `I also have information about ${sortedDocs.slice(2).map(d => d.destination_name).join(', ')}, which might be relevant.\n\n`;
  }
  
  return ragContext;
}

// Generate system prompt based on conversation context and travel documents
export function generateSystemPrompt(relevantDocs: any[], chatHistory: any[], isFollowUp = false) {
  const preferences = extractTravelPreferences(chatHistory);
  
  // Prepare context from relevant documents
  const ragContext = formatDocumentsForRAG(relevantDocs, isFollowUp);

  // Format detected preferences if any
  let preferencesContext = "";
  if (Object.values(preferences).some(val => val !== null && (Array.isArray(val) ? val.length > 0 : true))) {
    preferencesContext = "Based on the conversation, I've detected these travel preferences:\n";
    if (preferences.budget) preferencesContext += `- Budget: ${preferences.budget}\n`;
    if (preferences.region) preferencesContext += `- Region interest: ${preferences.region}\n`;
    if (preferences.interests.length > 0) preferencesContext += `- Interests: ${preferences.interests.join(', ')}\n`;
    if (preferences.duration) preferencesContext += `- Trip duration: ${preferences.duration}\n`;
    if (preferences.climate) preferencesContext += `- Climate preference: ${preferences.climate}\n`;
    if (preferences.travelWith) preferencesContext += `- Traveling as: ${preferences.travelWith}\n`;
    preferencesContext += "\nTake these preferences into account when responding.\n";
  }

  const systemPrompt = `You are a helpful, friendly travel assistant. Your purpose is to help users plan trips, recommend destinations, and provide travel advice.

${preferencesContext}

${ragContext}

When responding to users:
- Be concise and friendly
- If you're recommending destinations, explain why they might be a good fit based on their preferences
- If discussing specific destinations, mention key attractions, best time to visit, and practical tips
- For itinerary questions, provide structured day-by-day recommendations
- Suggest specific activities or experiences that match their interests
- Include budget considerations when relevant
- If you don't know something, be honest about it
- Focus on providing practical travel information
- If the user hasn't specified preferences, tactfully ask questions to understand their travel needs better
- Base your responses primarily on the travel information provided to you, and supplement with your general knowledge only when necessary`;

  return systemPrompt;
}
