import { getSupabase } from "@/lib/supabase/client";
import { isAdminEmail } from "@/lib/adminAuth";

/**
 * Customer login success email via Supabase Magic Link template.
 * Skips admin email — admin login never triggers Supabase mail.
 */
export async function notifyAuthSuccess(opts: {
  type: "signup" | "login";
  email?: string;
  name?: string;
}) {
  if (opts.type === "signup") return; // Confirm-signup email already sent by Supabase

  const email = opts.email?.trim();
  if (!email) return;

  // Never email the admin account through Supabase
  if (isAdminEmail(email)) return;

  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/`
          : undefined,
    },
  });
}
