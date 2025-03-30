
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

import { corsHeaders, validateEnvVars } from "./utils.ts";
import { generateEmbeddingForDocument, batchGenerateEmbeddings } from "./embedding.ts";
import { getRelevantDocuments, getChatHistory, analyzeConversationContext } from "./retrieval.ts";
import { generateSystemPrompt, isTravelRelated, getOffTopicResponse } from "./prompt.ts";

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
    
    // Handle API configuration check
    if (reqData.action === 'check_api_config') {
      if (!anthropicApiKey || anthropicApiKey.trim() === '') {
        return new Response(JSON.stringify({ 
          error: "Anthropic API key is not configured" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ configured: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
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
    
    // First, check if the message is travel-related
    const topicCheck = isTravelRelated(message);
    console.log(`Topic check: Is travel related - ${topicCheck.isTravelRelated} (confidence: ${topicCheck.confidence.toFixed(2)})`);
    
    // If the message is not travel-related, return a polite but firm off-topic response
    if (!topicCheck.isTravelRelated) {
      console.log(`Off-topic message detected: "${message.slice(0, 30)}..."`);
      
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
      
      // Generate and store off-topic response
      const offTopicResponse = getOffTopicResponse(message);
      
      try {
        await supabase.from('travel_chat_history').insert({
          session_id: sessionId,
          user_id: userId || null,
          role: 'assistant',
          content: offTopicResponse
        });
      } catch (error) {
        console.error("Failed to store off-topic response:", error);
      }
      
      return new Response(JSON.stringify({ 
        response: offTopicResponse,
        sessionId,
        isOffTopic: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // If we get here, the message is travel-related, so continue with normal processing
    
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

    // Get chat history first to analyze context
    const chatHistory = await getChatHistory(sessionId, supabase);
    const { isFollowUp } = analyzeConversationContext(chatHistory);
    
    console.log(`Query analyzed as ${isFollowUp ? 'follow-up question' : 'new question'}`);
    
    // Get relevant docs based on analysis
    const relevantDocs = await getRelevantDocuments(
      // For follow-up questions, use more context from previous messages
      isFollowUp ? 
        chatHistory.slice(-3).filter(msg => msg.role === 'user').map(msg => msg.content).join(" ") : 
        message, 
      supabase, 
      anthropicApiKey,
      isFollowUp ? 3 : 5  // Get more docs for new questions, fewer for follow-ups
    );
    
    // Format history for Claude
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Generate dynamic system prompt based on context
    const systemPrompt = generateSystemPrompt(relevantDocs, chatHistory, isFollowUp);

    // Make API call to Claude with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second timeout
    
    try {
      console.log(`Calling Claude API with ${formattedHistory.length} messages...`);
      
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
      
      console.log("Received response from Claude, storing in chat history...");
      
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
        sessionId,
        sources: relevantDocs.map(doc => ({
          name: doc.destination_name,
          similarity: doc.similarity
        }))
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
