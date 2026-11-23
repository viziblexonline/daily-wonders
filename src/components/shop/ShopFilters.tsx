"use client";

import { brands } from "@/data/products";
import type { ProductCategory, ProductType } from "@/types";
import { cn } from "@/lib/utils";

const categoryOptions: ProductCategory[] = [
  "Whey Protein",
  "Pre-Workout",
  "Creatine",
  "Mass Gainer",
  "Amino & BCAA",
  "Vitamins & Wellness",
];

const typeOptions: ProductType[] = [
  "Protein",
  "Pre-Workout",
  "Creatine",
  "Gainer",
  "Amino",
  "Vitamin",
];

export interface FilterState {
  categories: string[];
  brands: string[];
  types: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
}

interface ShopFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function ShopFilters({ filters, onChange, className }: ShopFiltersProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div>
        <h3 className="font-display text-lg tracking-widest">CATEGORY</h3>
        <ul className="mt-4 space-y-2.5">
          {categoryOptions.map((cat) => (
            <li key={cat}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-dw-soft hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      categories: toggle(filters.categories, cat),
                    })
                  }
                  className="h-4 w-4 accent-dw-lime"
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg tracking-widest">PRICE RANGE</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={filters.minPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  minPrice: Number(e.target.value) || 0,
                })
              }
              className="h-10 w-full border border-white/15 bg-dw-black px-3 text-sm outline-none focus:border-dw-lime"
              placeholder="Min"
            />
            <span className="text-dw-muted">–</span>
            <input
              type="number"
              min={0}
              value={filters.maxPrice}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: Number(e.target.value) || 500,
                })
              }
              className="h-10 w-full border border-white/15 bg-dw-black px-3 text-sm outline-none focus:border-dw-lime"
              placeholder="Max"
            />
          </div>
          <input
            type="range"
            min={0}
            max={300}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-dw-lime"
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg tracking-widest">BRAND</h3>
        <ul className="mt-4 space-y-2.5">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-dw-soft hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      brands: toggle(filters.brands, brand),
                    })
                  }
                  className="h-4 w-4 accent-dw-lime"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg tracking-widest">PRODUCT TYPE</h3>
        <ul className="mt-4 space-y-2.5">
          {typeOptions.map((type) => (
            <li key={type}>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-dw-soft hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      types: toggle(filters.types, type),
                    })
                  }
                  className="h-4 w-4 accent-dw-lime"
                />
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg tracking-widest">AVAILABILITY</h3>
        <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-dw-soft">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-4 w-4 accent-dw-lime"
          />
          In stock only
        </label>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            categories: [],
            brands: [],
            types: [],
            minPrice: 0,
            maxPrice: 300,
            inStockOnly: false,
          })
        }
        className="text-xs uppercase tracking-widest text-dw-muted hover:text-dw-lime"
      >
        Clear all filters
      </button>
    </div>
  );
}
