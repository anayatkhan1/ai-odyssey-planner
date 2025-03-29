
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Placeholder function to get embeddings (will be implemented with Anthropic API)
async function getEmbeddings(text: string) {
  // This is a placeholder - we'll implement it properly when we have the API key
  console.log("Will eventually use Anthropic for embeddings:", text);
  return new Array(1536).fill(0); // Returning a placeholder vector
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

    // For now, just return a placeholder response since we don't have the Anthropic API key yet
    const botResponse = "I'm your travel assistant, ready to help you plan your journey. I'll be fully operational once we integrate with Anthropic's Claude AI.";
    
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
