"use client";

import Image from "next/image";
import { testimonials } from "@/data/products";
import { StarRating } from "@/components/ui/StarRating";

export function Testimonials() {
  return (
    <section className="bg-dw-black py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
            Social Proof
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-wider md:text-5xl">
            TRUSTED BY ATHLETES
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col border border-white/10 bg-dw-charcoal p-6 md:p-8"
            >
              <StarRating rating={t.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-dw-soft md:text-base">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-dw-muted">{t.role}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
