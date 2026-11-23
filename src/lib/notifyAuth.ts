import { getSupabase } from "@/lib/supabase/client";

/**
 * Sends a success email using Supabase Auth built-in mailer (no Resend).
 * - signup: already sent by signUp when "Confirm email" is ON
 * - login: triggers Magic Link email (customize template text in Supabase)
 */
export async function notifyAuthSuccess(opts: {
  type: "signup" | "login";
  email?: string;
  name?: string;
}) {
  if (opts.type === "signup") return; // Confirm-signup email already sent by Supabase

  const email = opts.email?.trim();
  if (!email) return;

  const supabase = getSupabase();
  if (!supabase) return;

  // Uses Supabase's own email service (Magic Link template)
  await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/account`
          : undefined,
    },
  });
}
