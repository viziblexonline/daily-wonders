"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-dw-black">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85"
          alt="Athlete training in dramatic gym lighting"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="gradient-overlay absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-dw-black via-transparent to-dw-black/40" />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-4 pb-16 pt-28 md:items-center md:px-6 md:pb-24 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 animate-fade-up">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
              Daily Wonders · Protein & Supplements
            </p>
            <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.9] text-white">
              BUILT FOR YOUR
              <br />
              <span className="text-dw-lime">EVERYDAY STRENGTH.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-dw-soft md:text-lg">
              Premium protein, pre-workout, creatine, and recovery formulas to
              fuel your workouts and push beyond your limits.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop Now
              </ButtonLink>
              <ButtonLink href="/shop?filter=featured" variant="outline" size="lg">
                Explore Collection
                <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>

          <div className="relative hidden lg:col-span-5 lg:block animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="relative ml-auto aspect-[4/5] w-full max-w-md overflow-hidden border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1581009146145-b5ef0754ff07?w=900&q=85"
                alt="Featured athlete"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dw-black to-transparent p-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-dw-lime">
                  Featured Drop
                </p>
                <p className="mt-1 font-display text-2xl tracking-wider">
                  PROTEIN EDIT
                </p>
                <ButtonLink
                  href="/shop?category=Whey+Protein"
                  variant="primary"
                  size="sm"
                  className="mt-3"
                >
                  Shop Protein
                </ButtonLink>
              </div>
            </div>
            <div className="absolute -left-6 top-10 border border-dw-lime/40 bg-dw-black/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-widest text-dw-muted">
                Best Seller
              </p>
              <p className="font-display text-lg text-dw-lime">WHEY ISOLATE</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/10 bg-dw-black/80 py-3 backdrop-blur-sm">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-10 px-5">
              {[
                "FREE SHIPPING OVER $75",
                "PREMIUM QUALITY GUARANTEED",
                "30-DAY RETURNS",
                "ATHLETE TESTED",
                "NEW DROPS WEEKLY",
              ].map((t) => (
                <span
                  key={t}
                  className="font-display text-sm tracking-[0.2em] text-dw-muted"
                >
                  {t} ·
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
