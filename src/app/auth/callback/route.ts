import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (code) {
    const supabase = await createSupabaseServer();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Admin Google login — only allow admin email into /admin
        if (next.startsWith("/admin")) {
          if (!isAdminEmail(data.user?.email)) {
            await supabase.auth.signOut();
            return NextResponse.redirect(
              `${origin}/admin/login?error=${encodeURIComponent(
                "This Google account is not authorized for admin."
              )}`
            );
          }
          return NextResponse.redirect(`${origin}/admin`);
        }

        const createdAt = data.user?.created_at
          ? new Date(data.user.created_at).getTime()
          : 0;
        const isNew = Date.now() - createdAt < 60_000;
        const auth = isNew ? "signup" : "login";
        const dest = next === "/" ? `/?auth=${auth}` : next;
        return NextResponse.redirect(`${origin}${dest}`);
      }
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Missing auth code")}`
  );
}
