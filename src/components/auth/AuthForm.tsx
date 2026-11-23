"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { signIn, signUp, signInWithGoogle, supabaseReady } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (isSignup) {
        const err = await signUp(email, password, fullName);
        if (err) {
          setError(err);
          return;
        }
        setInfo(
          "Account created. If email confirmation is enabled, check your inbox — otherwise you’re ready to shop."
        );
        // If session is created immediately, go to account
        router.push("/account");
        return;
      }

      const err = await signIn(email, password);
      if (err) {
        setError(err);
        return;
      }
      router.push("/account");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    const err = await signInWithGoogle();
    if (err) {
      setError(err);
      setGoogleLoading(false);
    }
    // On success browser redirects to Google
  };

  return (
    <div className="w-full max-w-md border border-white/10 bg-dw-charcoal p-6 md:p-8">
      {!supabaseReady && (
        <p className="mb-4 border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
          Supabase keys missing — auth will not work until `.env.local` is set.
        </p>
      )}

      <button
        type="button"
        onClick={() => void handleGoogle()}
        disabled={googleLoading || !supabaseReady}
        className="flex h-12 w-full items-center justify-center gap-3 border border-white/15 bg-white text-sm font-semibold text-dw-black transition hover:bg-dw-soft disabled:opacity-50"
      >
        <GoogleIcon />
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
        {isSignup && (
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 w-full border border-white/15 bg-dw-black px-4 text-sm outline-none focus:border-dw-lime"
              placeholder="Your name"
            />
          </div>
        )}
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full border border-white/15 bg-dw-black px-4 text-sm outline-none focus:border-dw-lime"
            placeholder="you@email.com"
            autoComplete="email"
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
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={6}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {info && <p className="text-sm text-dw-lime">{info}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading || !supabaseReady}>
          {loading
            ? isSignup
              ? "Creating account…"
              : "Signing in…"
            : isSignup
              ? "Create Account"
              : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-dw-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-dw-lime hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-dw-lime hover:underline">
              Create account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.1 39.4 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 37.3 44 33 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}
