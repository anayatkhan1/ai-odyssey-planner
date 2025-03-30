
// Environment validation utility
export function validateEnvVars(
  supabaseUrl: string,
  supabaseServiceKey: string,
  anthropicApiKey: string
) {
  const missing = [];
  if (!supabaseUrl || supabaseUrl.trim() === '') missing.push('SUPABASE_URL');
  if (!supabaseServiceKey || supabaseServiceKey.trim() === '') missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!anthropicApiKey || anthropicApiKey.trim() === '') missing.push('ANTHROPIC_API_KEY');
  
  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    return { valid: false, message };
  }
  
  return { valid: true };
}

// Define CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
