type AuthEmailType = "signup" | "login";

export async function sendAuthSuccessEmail(opts: {
  to: string;
  name?: string;
  type: AuthEmailType;
}): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM || "Daily Wonders <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      ok: false,
      skipped: true,
      error: "RESEND_API_KEY is not configured",
    };
  }

  const isSignup = opts.type === "signup";
  const displayName = opts.name?.trim() || opts.to.split("@")[0];
  const subject = isSignup
    ? "Welcome to Daily Wonders — account created"
    : "Login successful — Daily Wonders";

  const title = isSignup ? "YOU'RE IN." : "LOGIN SUCCESSFUL.";
  const body = isSignup
    ? `Hi ${displayName}, your Daily Wonders account was created successfully. Fuel your training with premium protein & supplements.`
    : `Hi ${displayName}, you just signed in to Daily Wonders. If this wasn't you, reset your password or contact support.`;

  const html = `
  <div style="background:#090909;color:#fff;font-family:Arial,sans-serif;padding:32px">
    <div style="max-width:520px;margin:0 auto;background:#151515;border:1px solid #2a2a2a;padding:28px">
      <p style="color:#C6FF00;font-size:12px;letter-spacing:2px;margin:0 0 12px">DAILY WONDERS</p>
      <h1 style="font-size:28px;margin:0 0 16px;letter-spacing:1px">${title}</h1>
      <p style="color:#d4d4d4;line-height:1.6;margin:0 0 20px">${body}</p>
      <a href="https://www.dailywonders.co.uk/shop"
         style="display:inline-block;background:#C6FF00;color:#090909;text-decoration:none;padding:12px 20px;font-weight:700;letter-spacing:1px;font-size:12px">
        SHOP NOW
      </a>
      <p style="color:#777;font-size:12px;margin:24px 0 0">© Daily Wonders · Protein & Supplements</p>
    </div>
  </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: text || `Email failed (${res.status})` };
  }

  return { ok: true };
}
