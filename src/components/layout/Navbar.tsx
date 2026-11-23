"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=Whey+Protein", label: "Whey Protein" },
  { href: "/shop?category=Pre-Workout", label: "Pre-Workout" },
  { href: "/shop?category=Creatine", label: "Creatine" },
  { href: "/shop?filter=new", label: "New Arrivals" },
  { href: "/shop?filter=sale", label: "Sale" },
];

export function Navbar() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setSearchOpen,
  } = useStore();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountHref = user ? "/account" : "/login";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-white/5 bg-dw-black/95 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:h-[72px] md:px-6 lg:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center bg-dw-lime text-sm font-black text-dw-black">
              DW
            </span>
            <span className="font-display text-xl tracking-[0.12em] md:text-2xl">
              DAILY WONDERS
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] font-medium uppercase tracking-[0.14em] text-dw-soft transition-colors hover:text-dw-lime"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-dw-lime"
            >
              <Search size={18} />
            </button>
            <Link
              href={accountHref}
              aria-label={user ? "Account" : "Sign in"}
              className="relative hidden h-10 w-10 items-center justify-center text-white transition-colors hover:text-dw-lime sm:flex"
            >
              <User size={18} />
              {user && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-dw-lime" />
              )}
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-dw-lime"
            >
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-dw-lime px-1 text-[9px] font-bold text-dw-black">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Shopping bag"
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-dw-lime"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center bg-dw-lime px-1 text-[9px] font-bold text-dw-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/70 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={cn(
            "absolute left-0 top-0 flex h-full w-[min(100%,340px)] flex-col bg-dw-charcoal transition-transform duration-300",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <span className="font-display text-xl tracking-widest">MENU</span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-4 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:text-dw-lime"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/5 py-4 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:text-dw-lime"
            >
              {user ? "Account" : "Sign In"}
            </Link>
            {!user && (
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="border-b border-white/5 py-4 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:text-dw-lime"
              >
                Create Account
              </Link>
            )}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-sm font-medium uppercase tracking-[0.16em] text-dw-muted transition-colors hover:text-dw-lime"
            >
              Admin
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
