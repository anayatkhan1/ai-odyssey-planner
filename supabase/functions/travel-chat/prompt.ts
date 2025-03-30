
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

// Check if a query is travel-related
export function isTravelRelated(query: string): { isTravelRelated: boolean; confidence: number } {
  // Convert to lowercase for case-insensitive matching
  const normalizedQuery = query.toLowerCase();
  
  // List of travel-related keywords
  const travelKeywords = [
    'travel', 'trip', 'vacation', 'holiday', 'destination', 'tour', 'visit',
    'flight', 'hotel', 'resort', 'beach', 'mountain', 'city', 'country',
    'itinerary', 'guide', 'sightseeing', 'attraction', 'landmark', 'tourism',
    'tourist', 'backpacking', 'cruise', 'journey', 'excursion', 'getaway',
    'visa', 'passport', 'accommodation', 'lodging', 'stay', 'booking',
    'reservation', 'adventure', 'explore', 'discover', 'location', 'place',
    'recommendation', 'suggest', 'restaurant', 'food', 'cuisine', 'eat',
    'activity', 'transportation', 'airport', 'train', 'bus', 'car rental',
    'road trip', 'budget', 'cost', 'expense', 'cheap', 'expensive', 'luxury',
    'family', 'solo', 'couple', 'group', 'weather', 'season', 'summer', 
    'winter', 'spring', 'fall', 'autumn', 'packing', 'luggage', 'camping',
    'hiking', 'swimming', 'diving', 'skiing', 'culture', 'language',
    'local', 'native', 'festival', 'event', 'holiday', 'safety', 'safe',
    'dangerous', 'insurance', 'travel insurance', 'currency', 'money',
    'exchange', 'europe', 'asia', 'africa', 'north america', 'south america',
    'australia', 'antarctica', 'island', 'tropical', 'mediterranean',
    'nightlife', 'shopping', 'souvenir', 'photo', 'photography', 'view',
    'scenic', 'relax', 'peaceful', 'historic', 'modern', 'weekend',
    'week', 'month', 'day trip', 'checklist', 'tips', 'advice', 'planning'
  ];
  
  // Count how many travel keywords are present in the query
  let keywordMatches = 0;
  travelKeywords.forEach(keyword => {
    if (normalizedQuery.includes(keyword)) {
      keywordMatches++;
    }
  });
  
  // Calculate a confidence score (0-1)
  const confidence = Math.min(keywordMatches / 3, 1); // 3+ keywords = 100% confidence
  
  // Also check for explicit non-travel topics
  const nonTravelTopics = [
    'coding', 'programming', 'investment', 'stocks', 'crypto', 
    'recipe', 'cooking', 'medicine', 'diagnosis', 'legal advice',
    'lawsuit', 'divorce', 'marriage', 'dating', 'politics', 'election',
    'president', 'prime minister', 'horror movie', 'movie script',
    'write code', 'debug', 'fix my', 'solve this', 'math problem',
    'calculate', 'prove', 'theorem', 'equation', 'molecular', 'chemistry',
    'physics', 'quantum', 'artificial intelligence', 'machine learning',
    'neural network', 'blockchain', 'database', 'SQL', 'javascript',
    'python', 'java', 'c++', 'rust', 'golang', 'compiler', 'backend',
    'frontend', 'fullstack', 'web development', 'app development',
    'mobile app', 'operating system', 'linux', 'windows', 'macos',
    'hack', 'exploit', 'vulnerability', 'cybersecurity', 'penetration testing'
  ];
  
  // If any non-travel topic is explicitly mentioned, reduce confidence
  nonTravelTopics.forEach(topic => {
    if (normalizedQuery.includes(topic)) {
      confidence = Math.max(confidence - 0.5, 0); // Reduce confidence significantly
    }
  });
  
  return {
    isTravelRelated: confidence > 0.2, // Threshold of 0.2 to determine if travel-related
    confidence
  };
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
- Base your responses primarily on the travel information provided to you, and supplement with your general knowledge only when necessary
- IMPORTANT: You are ONLY designed to assist with travel-related questions. If users ask about non-travel topics, politely explain that you're a travel assistant and can only help with travel planning, destination recommendations, and travel advice. Then suggest they ask a travel-related question instead.`;

  return systemPrompt;
}

// Create a standardized off-topic response
export function getOffTopicResponse(query: string): string {
  return `I'm sorry, but I'm a travel assistant designed specifically to help with travel planning, destination recommendations, and travel advice. Your question about "${query.slice(0, 50)}${query.length > 50 ? '...' : ''}" appears to be outside my area of expertise.

I'd be happy to assist you with:
• Travel destination recommendations
• Itinerary planning
• Budget travel tips
• Accommodation suggestions
• Local attractions and activities
• Transportation options
• Travel safety information
• Seasonal travel advice

Please let me know if you have any travel-related questions!`;
}
