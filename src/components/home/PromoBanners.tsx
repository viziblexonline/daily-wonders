"use client";

import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export function PromoBanners() {
  return (
    <section className="bg-dw-black">
      {/* Full-bleed promo */}
      <div className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=85"
          alt="Athlete grinding"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-dw-black/65" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-[1440px] flex-col items-start justify-center px-4 md:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
            The Collection
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[0.95] tracking-wider md:text-7xl lg:text-8xl">
            YOUR GOALS.
            <br />
            YOUR GRIND.
            <br />
            <span className="text-dw-lime">YOUR FUEL.</span>
          </h2>
          <ButtonLink href="/shop" size="lg" className="mt-8">
            Shop Supplements
          </ButtonLink>
        </div>
      </div>

      {/* Split promos */}
      <div className="grid md:grid-cols-2">
        <div className="relative min-h-[50vh] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85"
            alt="Training intensity"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-dw-black/55" />
          <div className="relative flex h-full min-h-[50vh] flex-col justify-end p-8 md:p-12">
            <h3 className="font-display text-4xl tracking-wider md:text-5xl">
              LEVEL UP
              <br />
              YOUR TRAINING.
            </h3>
            <ButtonLink
              href="/shop?category=Pre-Workout"
              variant="primary"
              size="md"
              className="mt-6 w-fit"
            >
              Shop Pre-Workout
            </ButtonLink>
          </div>
        </div>
        <div className="relative min-h-[50vh] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=1200&q=85"
            alt="Whey protein collection"
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-dw-black/55" />
          <div className="relative flex h-full min-h-[50vh] flex-col justify-end p-8 md:p-12">
            <h3 className="font-display text-4xl tracking-wider md:text-5xl">
              FUEL UP.
              <br />
              GROW UP.
            </h3>
            <ButtonLink
              href="/shop?category=Whey+Protein"
              variant="secondary"
              size="md"
              className="mt-6 w-fit"
            >
              Shop Whey Protein
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
