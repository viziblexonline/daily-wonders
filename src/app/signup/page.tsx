"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
          Account
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wider md:text-6xl">
          CREATE ACCOUNT
        </h1>
        <p className="mt-3 mb-8 text-center text-sm text-dw-muted">
          Join Daily Wonders — email signup or Google.
        </p>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
