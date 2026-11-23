"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export default function WishlistPage() {
  const { wishlist, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <h1 className="font-display text-5xl tracking-wider md:text-6xl">
          WISHLIST
        </h1>
        <p className="mt-3 text-sm text-dw-muted">
          {items.length} saved {items.length === 1 ? "item" : "items"}
        </p>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 py-20 text-center">
            <Heart size={48} className="text-dw-muted" />
            <p className="text-dw-muted">Your wishlist is empty</p>
            <ButtonLink href="/shop">Browse Products</ButtonLink>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
