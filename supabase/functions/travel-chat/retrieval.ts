
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import { getEmbeddings } from "./embedding.ts";

// Retrieve relevant documents based on semantic search
export async function getRelevantDocuments(
  query: string, 
  supabase: ReturnType<typeof createClient>,
  anthropicApiKey: string,
  limit = 5, 
  threshold = 0.5
) {
  try {
    console.log(`Finding relevant documents for query: ${query.slice(0, 30)}...`);
    const embedding = await getEmbeddings(query, anthropicApiKey);
    
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
export async function getChatHistory(
  sessionId: string, 
  supabase: ReturnType<typeof createClient>,
  limit = 10
) {
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
