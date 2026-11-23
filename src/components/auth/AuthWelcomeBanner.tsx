"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { notifyAuthSuccess } from "@/lib/notifyAuth";

function BannerInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const authEvent = params.get("auth");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (loading || !authEvent) return;
    if (!user) return;

    const type = authEvent === "signup" ? "signup" : "login";
    setMessage(
      type === "signup"
        ? "Account created successfully — check your inbox for the welcome email."
        : "Login successful — a confirmation email is on the way."
    );

    void notifyAuthSuccess({
      type,
      email: user.email,
      name: (user.user_metadata?.full_name as string | undefined) || undefined,
    });

    router.replace("/", { scroll: false });
  }, [user, loading, authEvent, router]);

  if (!message) return null;

  return (
    <div className="fixed inset-x-0 top-16 z-40 px-4 md:top-[72px]">
      <div className="mx-auto flex max-w-3xl items-start gap-3 border border-dw-lime/40 bg-dw-charcoal/95 p-4 text-sm text-dw-lime shadow-lg backdrop-blur">
        <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
        <p className="flex-1">{message}</p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setMessage("")}
          className="text-dw-muted hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function AuthWelcomeBanner() {
  return (
    <Suspense fallback={null}>
      <BannerInner />
    </Suspense>
  );
}
