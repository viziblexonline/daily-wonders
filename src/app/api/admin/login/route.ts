import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getAdminCredentials } from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const { email, password, secret } = getAdminCredentials();
    const inputEmail = body.email?.trim().toLowerCase();
    const inputPassword = body.password ?? "";

    if (inputEmail !== email || inputPassword !== password) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin email or password" },
        { status: 401 }
      );
    }

    // Cookie session only — no Supabase auth, so no Supabase emails
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
