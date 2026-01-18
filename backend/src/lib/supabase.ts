import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create supabase client lazily to avoid build-time errors
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }
    _supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return _supabase;
};

// For backwards compatibility - creates client on first access
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as any)[prop];
  }
});
