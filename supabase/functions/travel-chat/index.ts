
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

// Get embeddings using Anthropic's API with improved error handling
async function getEmbeddings(text: string) {
  try {
    console.log(`Getting embeddings for: "${text.slice(0, 50)}..."`);
    
    if (!anthropicApiKey || anthropicApiKey.trim() === '') {
      throw new Error("Anthropic API key is not configured");
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
    throw error; // Re-throw to allow proper handling upstream
  }
}

// Function to generate and store embeddings for a document with better error handling
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

// Simplified document retrieval with better error handling
async function getRelevantDocuments(query: string, limit = 3) {
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
        match_threshold: 0.5,
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

// Simplified chat history retrieval
async function getChatHistory(sessionId: string, limit = 5) {
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

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      
      const results = [];
      for (const docId of document_ids) {
        // Get document content
        const { data: document, error: fetchError } = await supabase
          .from('travel_documents')
          .select('content')
          .eq('id', docId)
          .single();
          
        if (fetchError || !document) {
          results.push({ id: docId, success: false, error: fetchError?.message || "Document not found" });
          continue;
        }
        
        // Generate embedding
        const result = await generateEmbeddingForDocument(docId, document.content);
        results.push({ id: docId, ...result });
      }
      
      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle chat message
    const { message, sessionId, userId } = reqData;
    
    if (!message || !sessionId) {
      throw new Error("Missing required parameters for chat");
    }
    
    // Basic validation of API key
    if (!anthropicApiKey) {
      throw new Error("Anthropic API key is not configured");
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

    // Prepare context from relevant documents
    let ragContext = "";
    if (relevantDocs.length > 0) {
      ragContext = "Here is information about travel destinations that might be relevant:\n\n" + 
        relevantDocs.map(doc => `[${doc.destination_name}] ${doc.content}`).join("\n\n");
      console.log("RAG context provided with", relevantDocs.length, "documents");
    } else {
      console.log("No relevant documents found for RAG context");
    }

    // Prepare system prompt with RAG context
    const systemPrompt = `You are a helpful, friendly travel assistant. Your purpose is to help users plan trips, recommend destinations, and provide travel advice.
    
${ragContext}

When responding to users:
- Be concise and friendly
- If you're recommending destinations, explain why they might be a good fit
- If you don't know something, be honest about it
- Focus on providing practical travel information`;

    // Make API call to Claude with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
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
