
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// Get embeddings using Anthropic's API
export async function getEmbeddings(text: string, anthropicApiKey: string) {
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
    throw error;
  }
}

// Function to generate and store embeddings for a document
export async function generateEmbeddingForDocument(
  documentId: string, 
  content: string, 
  supabase: ReturnType<typeof createClient>,
  anthropicApiKey: string
) {
  try {
    console.log(`Generating embedding for document ID: ${documentId}`);
    
    if (!content || content.trim() === '') {
      throw new Error("Empty content provided for embedding generation");
    }
    
    // Get embedding from Anthropic
    const embedding = await getEmbeddings(content, anthropicApiKey);
    
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

// Handle batch document embedding generation
export async function batchGenerateEmbeddings(
  documentIds: string[], 
  supabase: ReturnType<typeof createClient>,
  anthropicApiKey: string
) {
  const results = [];
  
  for (const docId of documentIds) {
    try {
      // Get document content
      const { data: document, error: fetchError } = await supabase
        .from('travel_documents')
        .select('content')
        .eq('id', docId)
        .single();
        
      if (fetchError || !document) {
        results.push({ 
          id: docId, 
          success: false, 
          error: fetchError?.message || "Document not found" 
        });
        continue;
      }
      
      // Generate embedding
      const result = await generateEmbeddingForDocument(docId, document.content, supabase, anthropicApiKey);
      results.push({ id: docId, ...result });
    } catch (error) {
      results.push({ 
        id: docId, 
        success: false, 
        error: error.message || "Unknown error" 
      });
    }
  }
  
  return results;
}
