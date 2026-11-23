"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { StarRating } from "@/components/ui/StarRating";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const discount = getDiscountPercent(product.price, product.salePrice);
  const wished = isInWishlist(product.id);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-dw-charcoal">
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={product.images[0]?.startsWith("data:")}
          />
        </Link>

        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-dw-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dw-black">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dw-black">
              New
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-dw-black/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-dw-lime backdrop-blur-sm">
              Best Seller
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-dw-black/60 text-white backdrop-blur-sm transition-colors hover:text-dw-lime"
        >
          <Heart
            size={16}
            className={wished ? "fill-dw-lime text-dw-lime" : ""}
          />
        </button>

        <button
          type="button"
          onClick={() => addToCart(product.id)}
          className="absolute inset-x-3 bottom-3 z-10 flex h-10 translate-y-3 items-center justify-center gap-2 bg-dw-lime text-xs font-bold uppercase tracking-wider text-dw-black opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        >
          <ShoppingBag size={14} />
          Quick Add
        </button>
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <p className="text-[11px] uppercase tracking-widest text-dw-muted">
          {product.category}
        </p>
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium leading-snug transition-colors hover:text-dw-lime md:text-[15px]"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="text-[11px] text-dw-muted">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          {product.salePrice ? (
            <>
              <span className="text-sm font-semibold text-dw-lime">
                {formatPrice(product.salePrice)}
              </span>
              <span className="text-xs text-dw-muted line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
