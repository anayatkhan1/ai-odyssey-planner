
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
    const response = await fetch('https://api.anthropic.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        input: text,
        dimensions: 1536
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error('Error getting embeddings:', error);
    throw error;
  }
}

// Retrieve relevant documents for RAG
async function getRelevantDocuments(query: string, limit = 3) {
  try {
    // Get embeddings for the query
    const embedding = await getEmbeddings(query);

    // Search for similar documents in the database
    const { data: documents, error } = await supabase
      .rpc('match_travel_documents', {
        query_embedding: embedding,
        match_threshold: 0.5,
        match_count: limit
      });

    if (error) throw error;
    
    return documents || [];
  } catch (error) {
    console.error('Error retrieving relevant documents:', error);
    return [];
  }
}

// Function to get chat history for a session
async function getChatHistory(sessionId: string, limit = 10) {
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
  
  return data.reverse();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, userId } = await req.json();
    
    console.log(`Processing message for session ${sessionId}`);
    
    // Store user message in chat history
    await supabase.from('travel_chat_history').insert({
      session_id: sessionId,
      user_id: userId || null,
      role: 'user',
      content: message
    });

    if (!anthropicApiKey) {
      const placeholderResponse = "I'm your travel assistant, ready to help you plan your journey. I'll be fully operational once we integrate with Anthropic's Claude AI.";
      
      // Store placeholder response in chat history
      await supabase.from('travel_chat_history').insert({
        session_id: sessionId,
        user_id: userId || null,
        role: 'assistant',
        content: placeholderResponse
      });
      
      return new Response(JSON.stringify({ 
        response: placeholderResponse,
        sessionId 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get relevant travel documents for RAG
    const relevantDocs = await getRelevantDocuments(message);
    
    // Get recent chat history
    const chatHistory = await getChatHistory(sessionId, 5);
    
    // Format chat history for Claude
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Prepare context from relevant documents
    let ragContext = "";
    if (relevantDocs.length > 0) {
      ragContext = "Here is information about travel destinations that might be relevant to the query:\n\n" + 
        relevantDocs.map(doc => doc.content).join("\n\n");
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

    // Make the API call to Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        system: systemPrompt,
        messages: [...formattedHistory],
        max_tokens: 1024,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Anthropic API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const botResponse = data.content[0].text;
    
    // Store bot response in chat history
    await supabase.from('travel_chat_history').insert({
      session_id: sessionId,
      user_id: userId || null,
      role: 'assistant',
      content: botResponse
    });

    // Return the response
    return new Response(JSON.stringify({ 
      response: botResponse,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in travel-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
