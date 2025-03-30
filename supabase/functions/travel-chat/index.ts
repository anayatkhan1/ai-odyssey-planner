
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate if required environment variables are set
function validateEnvVars() {
  const missing = [];
  if (!supabaseUrl || supabaseUrl.trim() === '') missing.push('SUPABASE_URL');
  if (!supabaseServiceKey || supabaseServiceKey.trim() === '') missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!anthropicApiKey || anthropicApiKey.trim() === '') missing.push('ANTHROPIC_API_KEY');
  
  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    return { valid: false, message };
  }
  
  return { valid: true };
}

// Get embeddings using Anthropic's API
async function getEmbeddings(text: string) {
  try {
    console.log(`Getting embeddings for: "${text.slice(0, 50)}..."`);
    
    const validation = validateEnvVars();
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    
    const response = await fetch('https://api.anthropic.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': anthropicApiKey,
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        input: text,
        dimensions: 1536
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Anthropic API error (${response.status}):`, errorData);
      throw new Error(`Anthropic API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("Successfully generated embedding");
    return data.embedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    throw error;
  }
}

// Function to generate and store embeddings for a document
async function generateEmbeddingForDocument(documentId: string, content: string) {
  try {
    console.log(`Generating embedding for document ID: ${documentId}`);
    
    if (!content || content.trim() === '') {
      throw new Error("Empty content provided for embedding generation");
    }
    
    // Get embedding from Anthropic
    const embedding = await getEmbeddings(content);
    
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error("Failed to generate valid embedding");
    }
    
    // Update the document with the embedding
    const { error } = await supabase
      .from('travel_documents')
      .update({ embedding })
      .eq('id', documentId);
    
    if (error) {
      console.error("Database update error:", error);
      throw error;
    }
    
    console.log(`Successfully updated document ${documentId} with embedding`);
    return { success: true };
  } catch (error) {
    console.error('Error generating embedding for document:', error);
    return { 
      success: false, 
      error: error.message || "Unknown error in embedding generation",
      details: error
    };
  }
}

// Retrieve relevant documents based on semantic search
async function getRelevantDocuments(query: string, limit = 5, threshold = 0.5) {
  try {
    console.log(`Finding relevant documents for query: ${query.slice(0, 30)}...`);
    const embedding = await getEmbeddings(query);
    
    if (!embedding) {
      console.error("Failed to generate embedding for query");
      return [];
    }

    const { data: documents, error } = await supabase
      .rpc('match_travel_documents', {
        query_embedding: embedding,
        match_threshold: threshold,
        match_count: limit
      });

    if (error) {
      console.error("Error in match_travel_documents RPC:", error);
      throw error;
    }
    
    console.log(`Found ${documents?.length || 0} relevant documents`);
    return documents || [];
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return [];
  }
}

// Get chat history for context
async function getChatHistory(sessionId: string, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('travel_chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data.reverse();
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
}

// Extract travel preferences from user messages
function extractTravelPreferences(chatHistory) {
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

// Generate system prompt based on conversation context and travel documents
function generateSystemPrompt(relevantDocs, chatHistory) {
  const preferences = extractTravelPreferences(chatHistory);
  
  // Prepare context from relevant documents
  let ragContext = "";
  if (relevantDocs.length > 0) {
    ragContext = "Here is detailed information about travel destinations that might be relevant:\n\n" + 
      relevantDocs.map((doc, index) => 
        `[Destination ${index + 1}: ${doc.destination_name}]\n${doc.content}`
      ).join("\n\n");
  }

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
- If the user hasn't specified preferences, tactfully ask questions to understand their travel needs better`;

  return systemPrompt;
}

// Handle batch document embedding generation
async function batchGenerateEmbeddings(documentIds) {
  const results = [];
  
  for (const docId of documentIds) {
    try {
      // Get document content
      const { data: document, error: fetchError } = await supabase
        .from('travel_documents')
        .select('content')
        .eq('id', docId)
        .single();
        
      if (fetchError || !document) {
        results.push({ 
          id: docId, 
          success: false, 
          error: fetchError?.message || "Document not found" 
        });
        continue;
      }
      
      // Generate embedding
      const result = await generateEmbeddingForDocument(docId, document.content);
      results.push({ id: docId, ...result });
    } catch (error) {
      results.push({ 
        id: docId, 
        success: false, 
        error: error.message || "Unknown error" 
      });
    }
  }
  
  return results;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const validation = validateEnvVars();
    if (!validation.valid) {
      throw new Error(validation.message);
    }
    
    const reqData = await req.json();
    
    // Handle embedding generation
    if (reqData.action === 'generate_embedding') {
      const { document_id, content } = reqData;
      
      if (!document_id || !content) {
        throw new Error("Missing required parameters for embedding generation");
      }
      
      const result = await generateEmbeddingForDocument(document_id, content);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle batch embedding generation
    if (reqData.action === 'batch_generate_embeddings') {
      const { document_ids } = reqData;
      
      if (!document_ids || !Array.isArray(document_ids) || document_ids.length === 0) {
        throw new Error("Missing or invalid document_ids parameter");
      }
      
      const results = await batchGenerateEmbeddings(document_ids);
      
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle chat message
    const { message, sessionId, userId } = reqData;
    
    if (!message || !sessionId) {
      throw new Error("Missing required parameters for chat");
      
    }
    
    console.log(`Processing message for session ${sessionId}`);
    
    // Store user message
    try {
      await supabase.from('travel_chat_history').insert({
        session_id: sessionId,
        user_id: userId || null,
        role: 'user',
        content: message
      });
    } catch (error) {
      console.error("Failed to store user message:", error);
    }

    // Get relevant docs and chat history
    const relevantDocs = await getRelevantDocuments(message);
    const chatHistory = await getChatHistory(sessionId);
    
    // Format history for Claude
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate dynamic system prompt based on context
    const systemPrompt = generateSystemPrompt(relevantDocs, chatHistory);

    // Make API call to Claude with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': anthropicApiKey,
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          system: systemPrompt,
          messages: formattedHistory,
          max_tokens: 1024,
          temperature: 0.7
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Anthropic API error (${response.status}):`, errorText);
        throw new Error(`Anthropic API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const botResponse = data.content[0].text;
      
      // Store bot response
      try {
        await supabase.from('travel_chat_history').insert({
          session_id: sessionId,
          user_id: userId || null,
          role: 'assistant',
          content: botResponse
        });
      } catch (error) {
        console.error("Failed to store bot response:", error);
      }

      return new Response(JSON.stringify({ 
        response: botResponse,
        sessionId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      console.error('Timeout or error calling Claude API:', timeoutError);
      throw new Error("Request to AI service timed out or failed. Please try again.");
    }
  } catch (error) {
    console.error('Error in travel-chat function:', error);
    
    const errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
