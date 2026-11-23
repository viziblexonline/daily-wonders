"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getSupabase } from "@/lib/supabase/client";
import { AdminLoginErrorBanner } from "./error-banner";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@dailywonders.co.uk";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const assertAdmin = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data } = await supabase.auth.getUser();
    const userEmail = data.user?.email?.toLowerCase();
    if (!userEmail || userEmail !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut();
      throw new Error("This account is not authorized for admin access.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError(`Use the admin email: ${ADMIN_EMAIL}`);
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase is not configured");
        return;
      }

      let { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // First-time: create admin account with same email/password flow
      if (signInError) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: "Admin", role: "admin" },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
          },
        });
        if (signUpError) {
          setError(signInError.message || signUpError.message);
          return;
        }
        const retry = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        signInError = retry.error;
        if (signInError) {
          setError(
            "Account created — confirm your email (if required), then sign in again."
          );
          return;
        }
      }

      await assertAdmin();
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase is not configured");
      setGoogleLoading(false);
      return;
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dw-black px-4 pt-24 pb-16">
      <div className="w-full max-w-md border border-white/10 bg-dw-charcoal p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-dw-lime">
          Private
        </p>
        <h1 className="mt-2 font-display text-4xl tracking-wider">
          ADMIN LOGIN
        </h1>
        <p className="mt-2 text-sm text-dw-muted">
          Same login as the store — email/password or Google. Only the admin
          account can enter.
        </p>

        <div className="mt-4">
          <AdminLoginErrorBanner />
        </div>

        <button
          type="button"
          onClick={() => void handleGoogle()}
          disabled={googleLoading}
          className="mt-8 flex h-12 w-full items-center justify-center gap-3 border border-white/15 bg-white text-sm font-semibold text-dw-black transition hover:bg-dw-soft disabled:opacity-50"
        >
          {googleLoading ? "Redirecting…" : "Continue with Google"}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] uppercase tracking-widest text-dw-muted">
            or email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
              Admin email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full border border-white/15 bg-dw-black px-4 text-sm outline-none focus:border-dw-lime"
              placeholder={ADMIN_EMAIL}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full border border-white/15 bg-dw-black px-4 text-sm outline-none focus:border-dw-lime"
              placeholder="••••••••"
              autoComplete="current-password"
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Enter Admin Panel"}
          </Button>
        </form>
      </div>
    </div>
  );
}
