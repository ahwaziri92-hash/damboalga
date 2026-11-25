import { createClient } from "@supabase/supabase-js";
export const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const hasSupabase = !!(SB_URL && SB_KEY);
let browserClient = null;
// Shared client for the browser (admin panel, forms)
export function sb() {
  if (!hasSupabase) return null;
  if (typeof window === "undefined") return createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  if (!browserClient) browserClient = createClient(SB_URL, SB_KEY);
  return browserClient;
}
