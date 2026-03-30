import { createClient } from "@supabase/supabase-js"

// Fall back to placeholder values so createClient never throws at module load
// time when env vars are missing (e.g. Cloudflare Pages preview deployments).
// All API calls will simply fail/return empty and the app degrades gracefully.
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || "https://placeholder.supabase.co"
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || "placeholder-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
