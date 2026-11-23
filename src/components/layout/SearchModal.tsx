"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice, filterProducts } from "@/lib/utils";

export function SearchModal() {
  const { searchOpen, setSearchOpen, products } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return filterProducts(products, { search: query }).slice(0, 8);
  }, [products, query]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/80 animate-fade-in"
        onClick={() => setSearchOpen(false)}
      />
      <div className="relative mx-auto mt-16 w-full max-w-2xl px-4 animate-fade-up">
        <div className="overflow-hidden border border-white/10 bg-dw-charcoal">
          <div className="flex items-center gap-3 border-b border-white/10 px-4">
            <Search size={18} className="text-dw-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, brands..."
              className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-dw-muted"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="text-dw-muted hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          {query.trim() && (
            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
              {results.length === 0 ? (
                <p className="p-6 text-sm text-dw-muted">
                  No products found for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul>
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                      >
                        <div className="relative h-14 w-12 shrink-0 overflow-hidden bg-dw-surface">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-dw-muted">
                            {product.category}
                          </p>
                        </div>
                        <span className="text-sm text-dw-lime">
                          {formatPrice(product.salePrice ?? product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={() => setSearchOpen(false)}
                className="block border-t border-white/10 px-4 py-3 text-center text-xs uppercase tracking-widest text-dw-lime hover:bg-white/5"
              >
                View all results
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
