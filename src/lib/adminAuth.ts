export const ADMIN_COOKIE = "dw_admin_session";

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SECRET || "dw-admin-session-token",
  };
}

export function isValidAdminSession(token: string | undefined | null) {
  if (!token) return false;
  const { email, password, secret } = getAdminCredentials();
  if (!email || !password) return false;
  return token === secret;
}
