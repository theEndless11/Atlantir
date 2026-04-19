import { createClient } from '@supabase/supabase-js'

// Server-side only — uses service role key to bypass RLS where needed
export function useSupabaseAdmin() {
  const config = useRuntimeConfig()
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}
