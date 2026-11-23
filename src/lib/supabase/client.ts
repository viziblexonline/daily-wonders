import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  url &&
    anonKey &&
    !url.includes("YOUR_PROJECT") &&
    !anonKey.includes("YOUR_ANON_KEY")
);

let client: SupabaseClient | null = null;

/** Browser Supabase client — PKCE verifier stored in cookies via @supabase/ssr */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (typeof window === "undefined") return null;
  if (!client) {
    client = createBrowserClient(url!, anonKey!);
  }
  return client;
}
