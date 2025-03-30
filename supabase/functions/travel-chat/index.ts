
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { corsHeaders, validateEnvVars } from "./utils.ts";
import { generateEmbeddingForDocument, batchGenerateEmbeddings } from "./embedding.ts";
import { getRelevantDocuments, getChatHistory } from "./retrieval.ts";
import { generateSystemPrompt } from "./prompt.ts";

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const validation = validateEnvVars(supabaseUrl, supabaseServiceKey, anthropicApiKey);
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
      
      const result = await generateEmbeddingForDocument(document_id, content, supabase, anthropicApiKey);
      
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
      
      const results = await batchGenerateEmbeddings(document_ids, supabase, anthropicApiKey);
      
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
    const relevantDocs = await getRelevantDocuments(message, supabase, anthropicApiKey);
    const chatHistory = await getChatHistory(sessionId, supabase);
    
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
