"use client";

import Image from "next/image";
import { Instagram } from "lucide-react";
import { instagramImages } from "@/data/products";

export function InstagramGallery() {
  return (
    <section className="bg-dw-black pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
            @dailywonders
          </p>
          <h2 className="mt-2 font-display text-4xl tracking-wider md:text-5xl">
            THE GRIND, CAPTURED
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {instagramImages.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden bg-dw-charcoal"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-dw-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="text-dw-lime" size={24} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
