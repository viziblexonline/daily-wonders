"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, LogOut, Package, ShoppingBag, User, CheckCircle2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { Button, ButtonLink } from "@/components/ui/Button";
import { notifyAuthSuccess } from "@/lib/notifyAuth";

function AccountContent() {
  const { wishlist, cartCount, orders } = useStore();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const authEvent = params.get("auth");
  const [banner, setBanner] = useState("");

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || !authEvent) return;

    const type = authEvent === "signup" ? "signup" : "login";
    setBanner(
      type === "signup"
        ? "Account created successfully — check your email for confirmation."
        : "Login successful — check your email for confirmation."
    );

    void notifyAuthSuccess({
      type,
      email: user.email,
      name: (user.user_metadata?.full_name as string | undefined) || undefined,
    });

    // Clean query so refresh doesn't re-send forever
    router.replace("/account", { scroll: false });
  }, [user, authEvent, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24 text-dw-muted">
        Loading account…
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "Athlete";

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[900px] px-4 md:px-6">
        {banner && (
          <div className="mb-6 flex items-start gap-3 border border-dw-lime/40 bg-dw-lime/10 p-4 text-sm text-dw-lime">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{banner}</p>
          </div>
        )}

        <p className="text-xs uppercase tracking-[0.3em] text-dw-lime">
          Account
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wider">
          MY ACCOUNT
        </h1>
        <p className="mt-3 text-dw-muted">
          Welcome back, <span className="text-white">{displayName}</span>
          {user.email ? (
            <>
              {" "}
              · <span className="text-dw-soft">{user.email}</span>
            </>
          ) : null}
        </p>

        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
          >
            <LogOut size={14} /> Sign Out
          </Button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {[
            {
              href: "/cart",
              icon: ShoppingBag,
              title: "Shopping Bag",
              desc: `${cartCount} items`,
            },
            {
              href: "/wishlist",
              icon: Heart,
              title: "Wishlist",
              desc: `${wishlist.length} saved`,
            },
            {
              href: "/shop",
              icon: Package,
              title: "Continue Shopping",
              desc: "Browse supplements",
            },
            {
              href: "/admin",
              icon: User,
              title: "Admin Panel",
              desc: "Manage products & orders",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-4 border border-white/10 bg-dw-charcoal p-6 transition-colors hover:border-dw-lime"
            >
              <item.icon className="text-dw-lime" size={22} />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-dw-muted">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl tracking-widest">
            RECENT ORDERS
          </h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-dw-muted">No orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-white/10 border border-white/10">
              {orders.map((o) => (
                <li
                  key={o.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
                >
                  <div>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-dw-muted">
                      {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                      {o.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="capitalize text-dw-lime">{o.status}</p>
                    <p>${o.total.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <ButtonLink href="/shop" variant="outline" className="mt-6">
            Shop New Arrivals
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center pt-24 text-dw-muted">
          Loading account…
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
