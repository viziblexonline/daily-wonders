"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

function LoginContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const authError = params.get("error");

  useEffect(() => {
    if (!loading && user) router.replace("/account");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
          Account
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wider md:text-6xl">
          SIGN IN
        </h1>
        <p className="mt-3 mb-4 text-center text-sm text-dw-muted">
          Email &amp; password or continue with Google.
        </p>
        {authError && (
          <p className="mb-6 max-w-md text-center text-sm text-red-400">
            {authError}
          </p>
        )}
        <AuthForm mode="login" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center pt-24 text-dw-muted">
          Loading…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
