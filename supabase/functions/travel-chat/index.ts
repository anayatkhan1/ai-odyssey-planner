
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    // Parse the request body
    const { messages, destination } = await req.json();

    // Format the chat history for Claude API
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create a system prompt focused on travel information
    const systemPrompt = `You are a knowledgeable travel assistant. 
Your goal is to help users plan their travels by providing accurate, helpful information about destinations, travel tips, accommodations, and local customs.
${destination ? `The user is currently viewing information about ${destination}.` : ""}

Guidelines:
- Be conversational and friendly, but primarily informative
- Provide specific recommendations when appropriate
- If you don't know something, be honest about it
- Keep responses concise but informative
- Focus on practical travel advice and cultural insights
- Avoid controversial topics and focus on travel information`;

    // Call the Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        system: systemPrompt,
        messages: formattedMessages,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    // Return the Claude response
    return new Response(JSON.stringify({ 
      message: data.content[0].text,
      id: data.id
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in travel-chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
