"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export function ProductRail({
  title,
  subtitle,
  products,
  href = "/shop",
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section className="bg-dw-black py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            {subtitle && (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
                {subtitle}
              </p>
            )}
            <h2 className="mt-2 font-display text-4xl tracking-wider md:text-5xl">
              {title}
            </h2>
          </div>
          <Link
            href={href}
            className="text-xs uppercase tracking-[0.2em] text-dw-muted transition-colors hover:text-dw-lime"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
