"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/products";

export function CategoryGrid() {
  return (
    <section className="bg-dw-black py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 md:mb-14 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
              Shop by Category
            </p>
            <h2 className="mt-2 font-display text-4xl tracking-wider md:text-6xl">
              FIND YOUR EDGE
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-[0.2em] text-dw-muted transition-colors hover:text-dw-lime"
          >
            View all products →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[4/3] overflow-hidden bg-dw-charcoal"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="gradient-overlay-strong absolute inset-0" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                <h3 className="font-display text-2xl tracking-wider md:text-3xl">
                  {cat.name.toUpperCase()}
                </h3>
                <p className="mt-1 max-w-xs text-sm text-dw-soft">
                  {cat.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-dw-lime transition-transform group-hover:translate-x-1">
                  Shop Now <ArrowUpRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
