
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

// Get embeddings using Anthropic's API
async function getEmbeddings(text: string) {
  try {
    console.log("Getting embeddings for text:", text.slice(0, 50) + "...");
    
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
      console.error(`Anthropic Embeddings API error (${response.status}):`, errorData);
      throw new Error(`Anthropic Embeddings API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    console.log("Successfully received embeddings");
    return data.embedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    // Return null instead of throwing to allow fallback behavior
    return null;
  }
}

// Retrieve relevant documents for RAG
async function getRelevantDocuments(query: string, limit = 3) {
  try {
    // Get embeddings for the query
    const embedding = await getEmbeddings(query);
    
    // If no embedding could be generated, return empty array
    if (!embedding) {
      console.log("No embedding was generated, skipping document retrieval");
      return [];
    }

    console.log("Searching for relevant documents with embedding");
    
    // Search for similar documents in the database
    const { data: documents, error } = await supabase
      .rpc('match_travel_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit
      });

    if (error) {
      console.error('Error calling match_travel_documents RPC:', error);
      throw error;
    }
    
    console.log(`Found ${documents?.length || 0} relevant documents`);
    return documents || [];
  } catch (error) {
    console.error('Error retrieving relevant documents:', error);
    return [];
  }
}

// Function to get chat history for a session
async function getChatHistory(sessionId: string, limit = 10) {
  try {
    console.log(`Fetching chat history for session ${sessionId}`);
    
    const { data, error } = await supabase
      .from('travel_chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
    
    console.log(`Retrieved ${data.length} chat history messages`);
    return data.reverse();
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request to travel-chat function");
    
    const { message, sessionId, userId } = await req.json();
    
    if (!message || !sessionId) {
      throw new Error("Missing required parameters: message and sessionId");
    }
    
    console.log(`Processing message for session ${sessionId}`);
    
    // Check if Anthropic API key is available
    if (!anthropicApiKey) {
      console.error("No Anthropic API key found in environment variables");
      throw new Error("Anthropic API key is not configured");
    }
    
    // Store user message in chat history
    try {
      await supabase.from('travel_chat_history').insert({
        session_id: sessionId,
        user_id: userId || null,
        role: 'user',
        content: message
      });
      console.log("Stored user message in chat history");
    } catch (error) {
      console.error("Failed to store user message:", error);
      // Continue even if storing the message fails
    }

    // Get relevant travel documents for RAG
    console.log("Retrieving relevant documents for RAG");
    const relevantDocs = await getRelevantDocuments(message);
    
    // Get recent chat history
    console.log("Retrieving recent chat history");
    const chatHistory = await getChatHistory(sessionId, 5);
    
    // Format chat history for Claude
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Prepare context from relevant documents
    let ragContext = "";
    if (relevantDocs.length > 0) {
      console.log(`Including ${relevantDocs.length} relevant documents in context`);
      ragContext = "Here is information about travel destinations that might be relevant to the query:\n\n" + 
        relevantDocs.map(doc => `[${doc.destination_name}] ${doc.content}`).join("\n\n");
    } else {
      console.log("No relevant documents found to include in context");
    }

    // Prepare system prompt with RAG context
    const systemPrompt = `You are a helpful, friendly travel assistant. Your purpose is to help users plan trips, recommend destinations, and provide travel advice.
    
${ragContext}

When responding to users:
- Be concise, friendly, and helpful
- If you're recommending destinations, explain why they might be a good fit
- If you don't know something, be honest about it
- Focus on providing practical travel information
- Don't make up information about destinations
- If you reference a specific destination, mention relevant details like the best time to visit, major attractions, or visa requirements if you know them`;

    console.log("Making API call to Claude");
    
    // Make the API call to Claude
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
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Claude API error (${response.status}):`, errorData);
      throw new Error(`Anthropic API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const botResponse = data.content[0].text;
    
    console.log("Received response from Claude, storing in chat history");
    
    // Store bot response in chat history
    try {
      await supabase.from('travel_chat_history').insert({
        session_id: sessionId,
        user_id: userId || null,
        role: 'assistant',
        content: botResponse
      });
    } catch (error) {
      console.error("Failed to store bot response:", error);
      // Continue even if storing the response fails
    }

    // Return the response
    console.log("Sending successful response");
    return new Response(JSON.stringify({ 
      response: botResponse,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in travel-chat function:', error);
    
    // Generate a clean error message for the user
    const errorMessage = "Sorry, I'm having trouble connecting. Please try again later.";
    
    try {
      // Store error message in chat history if we have session ID
      const requestData = await req.json().catch(() => ({}));
      const sessionId = requestData.sessionId;
      
      if (sessionId) {
        await supabase.from('travel_chat_history').insert({
          session_id: sessionId,
          user_id: requestData.userId || null,
          role: 'system',
          content: errorMessage
        }).catch(e => console.error("Failed to store error message:", e));
      }
    } catch (e) {
      console.error("Error handling the error:", e);
    }
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
