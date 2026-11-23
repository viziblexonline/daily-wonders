import type { Product, SortOption } from "@/types";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function getDiscountPercent(price: number, salePrice?: number) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function getEffectivePrice(product: Product) {
  return product.salePrice ?? product.price;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "price-asc":
      return sorted.sort(
        (a, b) => getEffectivePrice(a) - getEffectivePrice(b)
      );
    case "price-desc":
      return sorted.sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a)
      );
    case "best-selling":
      return sorted.sort((a, b) => {
        if (a.bestSeller !== b.bestSeller) return a.bestSeller ? -1 : 1;
        return b.reviewCount - a.reviewCount;
      });
    case "featured":
    default:
      return sorted.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.rating - a.rating;
      });
  }
}

export function filterProducts(
  products: Product[],
  opts: {
    search?: string;
    categories?: string[];
    brands?: string[];
    types?: string[];
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
  }
) {
  return products.filter((p) => {
    if (opts.search) {
      const q = opts.search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (opts.categories?.length && !opts.categories.includes(p.category))
      return false;
    if (opts.brands?.length && !opts.brands.includes(p.brand)) return false;
    if (opts.types?.length && !opts.types.includes(p.type)) return false;
    const price = getEffectivePrice(p);
    if (opts.minPrice !== undefined && price < opts.minPrice) return false;
    if (opts.maxPrice !== undefined && price > opts.maxPrice) return false;
    if (opts.inStockOnly && p.stock <= 0) return false;
    return true;
  });
}
