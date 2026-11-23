"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, Search, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ShopFilters,
  type FilterState,
} from "@/components/shop/ShopFilters";
import { filterProducts, sortProducts } from "@/lib/utils";
import type { SortOption } from "@/types";

function ShopContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    types: [],
    minPrice: 0,
    maxPrice: 300,
    inStockOnly: false,
  });
  const [specialFilter, setSpecialFilter] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get("category");
    const q = searchParams.get("search");
    const filter = searchParams.get("filter");
    const sortParam = searchParams.get("sort") as SortOption | null;

    if (category) {
      setFilters((f) => ({ ...f, categories: [category] }));
    }
    if (q) setSearch(q);
    if (filter) setSpecialFilter(filter);
    if (sortParam) setSort(sortParam);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = filterProducts(products, {
      search,
      categories: filters.categories,
      brands: filters.brands,
      types: filters.types,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStockOnly: filters.inStockOnly,
    });

    if (specialFilter === "new") list = list.filter((p) => p.isNew);
    if (specialFilter === "sale") list = list.filter((p) => !!p.salePrice);
    if (specialFilter === "bestseller")
      list = list.filter((p) => p.bestSeller);
    if (specialFilter === "featured") list = list.filter((p) => p.featured);

    return sortProducts(list, sort);
  }, [products, search, filters, sort, specialFilter]);

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-dw-lime">
            Catalog
          </p>
          <h1 className="mt-2 font-display text-5xl tracking-wider md:text-6xl">
            SHOP ALL
          </h1>
          <p className="mt-3 text-sm text-dw-muted">
            {filtered.length} products
            {specialFilter ? ` · ${specialFilter}` : ""}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex h-11 items-center gap-2 border border-white/15 px-4 text-xs uppercase tracking-widest lg:hidden"
            >
              <Filter size={14} /> Filters
            </button>
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-dw-muted"
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-11 w-full border border-white/15 bg-dw-charcoal pl-10 pr-3 text-sm outline-none focus:border-dw-lime"
              />
            </div>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-11 border border-white/15 bg-dw-charcoal px-3 text-sm outline-none focus:border-dw-lime"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="best-selling">Best Selling</option>
          </select>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-64 shrink-0 lg:block">
            <ShopFilters filters={filters} onChange={setFilters} />
          </aside>

          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="border border-white/10 py-24 text-center">
                <p className="text-dw-muted">No products match your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      categories: [],
                      brands: [],
                      types: [],
                      minPrice: 0,
                      maxPrice: 300,
                      inStockOnly: false,
                    });
                    setSearch("");
                    setSpecialFilter(null);
                  }}
                  className="mt-4 text-xs uppercase tracking-widest text-dw-lime"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setFilterOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(100%,340px)] flex-col bg-dw-charcoal animate-slide-in-right">
            <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
              <span className="font-display text-xl tracking-widest">
                FILTERS
              </span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFilterOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <ShopFilters filters={filters} onChange={setFilters} />
            </div>
            <div className="border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => setFilterOpen(false)}
                className="h-11 w-full bg-dw-lime text-sm font-bold uppercase tracking-wider text-dw-black"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center pt-24 text-dw-muted">
          Loading shop...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
