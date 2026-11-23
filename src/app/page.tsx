"use client";

import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductRail } from "@/components/home/ProductRail";
import { PromoBanners } from "@/components/home/PromoBanners";
import { BrandStory } from "@/components/home/BrandStory";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { AuthWelcomeBanner } from "@/components/auth/AuthWelcomeBanner";
import { useStore } from "@/context/StoreContext";

export default function HomePage() {
  const { products } = useStore();

  const bestSellers = products.filter((p) => p.bestSeller);
  const newArrivals = [...products]
    .filter((p) => p.isNew)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  const trending = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 4);
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <AuthWelcomeBanner />
      <Hero />
      <CategoryGrid />
      <ProductRail
        subtitle="Most Loved"
        title="BEST SELLERS"
        products={bestSellers.length ? bestSellers : products}
        href="/shop?filter=bestseller"
      />
      <PromoBanners />
      <ProductRail
        subtitle="Just Dropped"
        title="NEW ARRIVALS"
        products={newArrivals.length ? newArrivals : products}
        href="/shop?filter=new"
      />
      <ProductRail
        subtitle="Trending Now"
        title="TRENDING PRODUCTS"
        products={trending}
        href="/shop?sort=best-selling"
      />
      <BrandStory />
      <ProductRail
        subtitle="Curated Picks"
        title="FEATURED COLLECTION"
        products={featured.length ? featured : products}
        href="/shop?filter=featured"
      />
      <Testimonials />
      <InstagramGallery />
    </>
  );
}
