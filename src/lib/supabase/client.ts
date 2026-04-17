import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
// Nota: Para tipos completos, execute:
// npx supabase gen types typescript --project-id SEU_ID > src/types/database.ts
