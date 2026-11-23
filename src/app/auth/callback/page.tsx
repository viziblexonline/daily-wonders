"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase is not configured.");
        return;
      }

      // Handles PKCE / code exchange when present in URL
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/account");
        return;
      }

      setError("Could not complete sign-in. Please try again.");
    };

    void run();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-dw-black px-4 pt-24">
      <div className="text-center">
        <p className="font-display text-3xl tracking-widest text-dw-lime">
          {error ? "SIGN-IN FAILED" : "SIGNING YOU IN…"}
        </p>
        <p className="mt-3 text-sm text-dw-muted">
          {error || "Please wait while we finish authentication."}
        </p>
        {error && (
          <a
            href="/login"
            className="mt-6 inline-block text-xs uppercase tracking-widest text-dw-lime"
          >
            Back to login
          </a>
        )}
      </div>
    </div>
  );
}
