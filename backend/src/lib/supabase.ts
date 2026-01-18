import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Loading Supabase...');
console.log('URL:', supabaseUrl);
console.log('Service Role Key exists:', supabaseServiceRoleKey.length > 0);

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(`Missing Supabase env vars. URL: ${!!supabaseUrl}, Service Role Key: ${!!supabaseServiceRoleKey}`);
}

// Use service role key for admin operations (creating users in Auth)
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
