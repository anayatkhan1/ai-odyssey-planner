
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

    // Call the Supabase edge function
    const { data, error } = await supabase.functions.invoke('travel-chat', {
      body: { 
        messages: formattedMessages,
        destination
      },
    });

    if (error) {
      console.error('Error calling travel-chat function:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in getChatResponse:', error);
    throw error;
  }
}
