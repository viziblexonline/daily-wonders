"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { Button } from "@/components/ui/Button";

const shopLinks = [
  { href: "/shop", label: "All Supplements" },
  { href: "/shop?category=Whey+Protein", label: "Whey Protein" },
  { href: "/shop?category=Pre-Workout", label: "Pre-Workout" },
  { href: "/shop?category=Creatine", label: "Creatine" },
  { href: "/shop?filter=sale", label: "Sale" },
];

const supportLinks = [
  { href: "/login", label: "Sign In" },
  { href: "/signup", label: "Create Account" },
  { href: "/account", label: "My Account" },
  { href: "/cart", label: "Shopping Cart" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/admin", label: "Admin Panel" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-dw-charcoal">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-dw-lime text-sm font-black text-dw-black">
                DW
              </span>
              <span className="font-display text-xl tracking-[0.12em]">
                DAILY WONDERS
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-dw-muted">
              Premium protein and supplements engineered for athletes who refuse
              to settle.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex h-10 w-10 items-center justify-center border border-white/15 text-dw-muted transition-colors hover:border-dw-lime hover:text-dw-lime"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-widest text-white">
              SHOP
            </h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-dw-muted transition-colors hover:text-dw-lime"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-widest text-white">
              SUPPORT
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-dw-muted transition-colors hover:text-dw-lime"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg tracking-widest text-white">
              NEWSLETTER
            </h3>
            <p className="mt-4 text-sm text-dw-muted">
              Get early access to drops, exclusive deals, and training tips.
            </p>
            <form onSubmit={handleNewsletter} className="mt-4 space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus("idle");
                }}
                placeholder="Enter your email"
                className="h-11 w-full border border-white/15 bg-dw-black px-3 text-sm outline-none focus:border-dw-lime"
                required
              />
              <Button type="submit" className="w-full" size="md">
                Subscribe
              </Button>
              {status === "error" && (
                <p className="text-xs text-red-400">
                  Please enter a valid email address.
                </p>
              )}
              {status === "success" && (
                <p className="text-xs text-dw-lime">
                  You&apos;re in. Welcome to Daily Wonders.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-dw-muted md:flex-row">
          <p>© {new Date().getFullYear()} Daily Wonders. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/shop" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/shop" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
