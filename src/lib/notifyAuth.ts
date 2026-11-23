export async function notifyAuthSuccess(opts: {
  type: "signup" | "login";
  email?: string;
  name?: string;
}) {
  try {
    await fetch("/api/auth/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
  } catch {
    // Non-blocking — UI success still shows
  }
}
