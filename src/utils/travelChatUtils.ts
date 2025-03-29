
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export async function getChatResponse(messages: Message[], destination?: string) {
  try {
    // Remove timestamps from messages for the API call
    const formattedMessages = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    try {
      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('travel-chat', {
        body: { 
          messages: formattedMessages,
          destination
        },
      });

      if (error) {
        console.error('Error calling travel-chat function:', error);
        // Return a fallback response instead of throwing
        return {
          role: 'assistant',
          content: "I'm sorry, I couldn't process your request right now. Please try again later."
        };
      }

      return data;
    } catch (error) {
      console.error('Error in getChatResponse:', error);
      // Return a fallback response
      return {
        role: 'assistant',
        content: "I'm having trouble connecting to the service. Please try again in a moment."
      };
    }
  } catch (error) {
    console.error('Error formatting messages:', error);
    // Return a fallback response
    return {
      role: 'assistant',
      content: "There was an error processing your message. Please try again."
    };
  }
}
