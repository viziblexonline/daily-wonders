export const ADMIN_COOKIE = "dw_admin_session";

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@dailywonders.co.uk")
      .trim()
      .toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "DW@Admin2026!",
    secret: process.env.ADMIN_SECRET || "dw_admin_sess_9f3k2m7xQLwP",
  };
}

export function isValidAdminSession(token: string | undefined | null) {
  if (!token) return false;
  const { secret } = getAdminCredentials();
  return token === secret;
}

/** Admin is NOT a Supabase user — never send auth emails for this path. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const { email: adminEmail } = getAdminCredentials();
  return email.trim().toLowerCase() === adminEmail;
}
