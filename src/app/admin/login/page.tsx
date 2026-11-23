"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@dailywonders.co.uk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
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
          Private staff access — no confirmation emails are sent.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              placeholder="admin@dailywonders.co.uk"
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
