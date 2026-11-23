import { NextResponse } from "next/server";
import { sendAuthSuccessEmail } from "@/lib/email";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      type?: "signup" | "login";
      email?: string;
      name?: string;
    };

    const type = body.type === "signup" ? "signup" : "login";

    // Prefer authenticated session email (safer)
    const supabase = await createSupabaseServer();
    let email = body.email?.trim().toLowerCase();
    let name = body.name?.trim();

    if (supabase) {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        email = data.user.email;
        name =
          name ||
          (data.user.user_metadata?.full_name as string | undefined) ||
          undefined;
      }
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Valid email required" },
        { status: 400 }
      );
    }

    const result = await sendAuthSuccessEmail({ to: email, name, type });

    if (result.skipped) {
      return NextResponse.json({
        ok: false,
        skipped: true,
        error: result.error,
      });
    }

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Notify failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
