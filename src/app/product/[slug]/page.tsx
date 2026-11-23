"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Package,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/product/ProductCard";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";

type Tab = "description" | "specs" | "reviews" | "shipping";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const {
    getProduct,
    products,
    reviews,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const product = getProduct(slug);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [variation, setVariation] = useState<string | undefined>();
  const [tab, setTab] = useState<Tab>("description");

  const productReviews = useMemo(
    () => (product ? reviews.filter((r) => r.productId === product.id) : []),
    [reviews, product]
  );

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-24">
        <p className="text-dw-muted">Product not found.</p>
        <Link href="/shop" className="text-dw-lime uppercase tracking-widest text-sm">
          Back to shop
        </Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.salePrice);
  const wished = isInWishlist(product.id);
  const selectedVariation = variation ?? product.variations?.options[0];

  const handleAdd = () => {
    addToCart(product.id, quantity, selectedVariation);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedVariation);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <nav className="mb-8 text-xs text-dw-muted">
          <Link href="/" className="hover:text-dw-lime">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-dw-lime">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-dw-charcoal">
              <Image
                src={product.images[activeImage] ?? product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discount > 0 && (
                <span className="absolute left-4 top-4 bg-dw-lime px-2.5 py-1 text-xs font-bold text-dw-black">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-16 shrink-0 overflow-hidden border-2",
                    activeImage === i
                      ? "border-dw-lime"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-dw-lime">
              {product.brand} · {product.category}
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-wider md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={product.rating} size={16} />
              <span className="text-sm text-dw-muted">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-semibold text-dw-lime">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-lg text-dw-muted line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-dw-soft md:text-base">
              {product.description}
            </p>

            <ul className="mt-5 space-y-2">
              {product.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-sm text-dw-soft"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-dw-lime" />
                  {b}
                </li>
              ))}
            </ul>

            {product.variations && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-widest text-dw-muted">
                  {product.variations.label}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variations.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setVariation(opt)}
                      className={cn(
                        "h-10 min-w-12 border px-4 text-sm transition-colors",
                        (selectedVariation === opt)
                          ? "border-dw-lime bg-dw-lime text-dw-black"
                          : "border-white/20 hover:border-dw-lime"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-2 text-sm">
              <Package size={16} className="text-dw-lime" />
              {product.stock > 0 ? (
                <span className="text-dw-soft">
                  In stock — {product.stock} available
                </span>
              ) : (
                <span className="text-red-400">Out of stock</span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center border border-white/20">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex h-12 w-11 items-center justify-center hover:bg-white/5"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex h-12 w-11 items-center justify-center hover:bg-white/5"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={product.stock <= 0}
                size="lg"
                className="flex-1 min-w-[140px]"
              >
                Add to Cart
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                variant="secondary"
                size="lg"
                className="flex-1 min-w-[120px]"
              >
                Buy Now
              </Button>
              <button
                type="button"
                aria-label="Wishlist"
                onClick={() => toggleWishlist(product.id)}
                className="flex h-12 w-12 items-center justify-center border border-white/20 hover:border-dw-lime hover:text-dw-lime"
              >
                <Heart
                  size={18}
                  className={wished ? "fill-dw-lime text-dw-lime" : ""}
                />
              </button>
            </div>

            <div className="mt-8 grid gap-3 border border-white/10 bg-dw-charcoal p-5 sm:grid-cols-3">
              <div className="flex items-start gap-2 text-xs text-dw-muted">
                <Truck size={16} className="mt-0.5 shrink-0 text-dw-lime" />
                Free shipping over $75
              </div>
              <div className="flex items-start gap-2 text-xs text-dw-muted">
                <RotateCcw size={16} className="mt-0.5 shrink-0 text-dw-lime" />
                30-day easy returns
              </div>
              <div className="flex items-start gap-2 text-xs text-dw-muted">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-dw-lime" />
                Secure checkout
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-6 overflow-x-auto border-b border-white/10">
            {(
              [
                ["description", "Description"],
                ["specs", "Specifications"],
                ["reviews", "Reviews"],
                ["shipping", "Shipping & Returns"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "shrink-0 border-b-2 pb-3 text-xs uppercase tracking-widest transition-colors",
                  tab === key
                    ? "border-dw-lime text-dw-lime"
                    : "border-transparent text-dw-muted hover:text-white"
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="py-8 text-sm leading-relaxed text-dw-soft">
            {tab === "description" && (
              <div className="max-w-3xl space-y-4">
                <p>{product.description}</p>
                <p>
                  Engineered for serious athletes who demand more from every
                  session. Pair with your training plan for measurable results.
                </p>
              </div>
            )}
            {tab === "specs" && (
              <dl className="grid max-w-xl gap-3 sm:grid-cols-2">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div
                    key={k}
                    className="border border-white/10 bg-dw-charcoal p-4"
                  >
                    <dt className="text-xs uppercase tracking-widest text-dw-muted">
                      {k}
                    </dt>
                    <dd className="mt-1 text-white">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tab === "reviews" && (
              <div className="max-w-2xl space-y-6">
                {productReviews.length === 0 ? (
                  <p className="text-dw-muted">
                    No reviews yet. Be the first to share your experience.
                  </p>
                ) : (
                  productReviews.map((r) => (
                    <div
                      key={r.id}
                      className="border-b border-white/10 pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium text-white">{r.author}</p>
                          <StarRating rating={r.rating} size={12} className="mt-1" />
                        </div>
                        <span className="text-xs text-dw-muted">{r.date}</span>
                      </div>
                      <p className="mt-3">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
            {tab === "shipping" && (
              <div className="max-w-2xl space-y-4">
                <p>
                  <strong className="text-white">Shipping:</strong> Orders
                  process within 1–2 business days. Free standard shipping on
                  orders over $75. Express options available at checkout.
                </p>
                <p>
                  <strong className="text-white">Returns:</strong> Unopened
                  supplements and unused apparel can be returned within 30 days
                  for a full refund. Contact support to initiate a return.
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-3xl tracking-wider md:text-4xl">
              YOU MAY ALSO LIKE
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
