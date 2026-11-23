"use client";

import Link from "next/link";
import { Heart, Package, ShoppingBag, User } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ButtonLink } from "@/components/ui/Button";

export default function AccountPage() {
  const { wishlist, cartCount, orders } = useStore();

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[900px] px-4 md:px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-dw-lime">
          Account
        </p>
        <h1 className="mt-2 font-display text-5xl tracking-wider">
          MY ACCOUNT
        </h1>
        <p className="mt-3 text-dw-muted">
          Welcome back. Manage your bag, wishlist, and orders.
        </p>

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
              desc: "Browse the catalog",
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
