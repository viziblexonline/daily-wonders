import { NextResponse } from "next/server";

/**
 * Kept for compatibility. Real emails are sent by Supabase Auth
 * (Confirm signup / magic link templates) — no Resend required.
 */
export async function POST() {
  return NextResponse.json({ ok: true, provider: "supabase-auth" });
}
