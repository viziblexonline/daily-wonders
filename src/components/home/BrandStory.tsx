"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="bg-dw-charcoal py-20 md:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 md:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/6]">
          <Image
            src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1000&q=85"
            alt="Daily Wonders brand story"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
            Our Story
          </p>
          <h2 className="mt-3 font-display text-4xl tracking-wider md:text-6xl">
            BUILT BY
            <br />
            ATHLETES.
            <br />
            FOR ATHLETES.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-dw-soft">
            Daily Wonders was founded on a simple belief: every training day
            deserves fuel that matches your ambition. From clinically dosed whey
            to pre-workout and creatine, we obsess over the formula so you can
            obsess over the work.
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-dw-muted">
            No shortcuts. No filler. Just premium protein and supplements
            engineered for the everyday grind that builds extraordinary strength.
          </p>
          <ButtonLink href="/shop" variant="outline" size="lg" className="mt-8">
            Discover the Brand
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
