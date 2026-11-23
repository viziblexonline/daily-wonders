"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function CartPage() {
  const {
    cart,
    products,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    applyDiscount,
    discountPercent,
    discountCode,
  } = useStore();
  const [codeInput, setCodeInput] = useState("");
  const [codeMsg, setCodeMsg] = useState("");

  const discount = (cartSubtotal * discountPercent) / 100;
  const total = cartSubtotal - discount;

  const handleApply = () => {
    const pct = applyDiscount(codeInput);
    setCodeMsg(
      pct > 0
        ? `${pct}% discount applied!`
        : "Invalid code. Try WONDERS10, STRENGTH15, or LEVELUP20"
    );
  };

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <h1 className="font-display text-5xl tracking-wider md:text-6xl">
          YOUR BAG
        </h1>

        {cart.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center gap-4 py-20 text-center">
            <ShoppingBag size={48} className="text-dw-muted" />
            <p className="text-dw-muted">Your bag is empty</p>
            <ButtonLink href="/shop">Continue Shopping</ButtonLink>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-white/10 border border-white/10">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const price = product.salePrice ?? product.price;
                  return (
                    <li
                      key={`${item.productId}-${item.variation ?? ""}`}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6"
                    >
                      <Link
                        href={`/product/${product.slug}`}
                        className="relative h-28 w-24 shrink-0 overflow-hidden bg-dw-charcoal"
                      >
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              href={`/product/${product.slug}`}
                              className="font-medium hover:text-dw-lime"
                            >
                              {product.name}
                            </Link>
                            {item.variation && (
                              <p className="mt-1 text-xs text-dw-muted">
                                {product.variations?.label}: {item.variation}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            aria-label="Remove item"
                            onClick={() =>
                              removeFromCart(item.productId, item.variation)
                            }
                            className="text-dw-muted hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-white/15">
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variation
                                )
                              }
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="flex h-9 w-9 items-center justify-center"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                  item.variation
                                )
                              }
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <ButtonLink
                href="/shop"
                variant="ghost"
                className="mt-4"
              >
                ← Continue Shopping
              </ButtonLink>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-white/10 bg-dw-charcoal p-6">
                <h2 className="font-display text-2xl tracking-widest">
                  ORDER SUMMARY
                </h2>
                <div className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={codeInput || discountCode}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Discount code"
                    className="h-11 flex-1 border border-white/15 bg-dw-black px-3 text-sm outline-none focus:border-dw-lime"
                  />
                  <Button variant="outline" size="sm" onClick={handleApply}>
                    Apply
                  </Button>
                </div>
                {codeMsg && (
                  <p
                    className={`mt-2 text-xs ${
                      discountPercent > 0 ? "text-dw-lime" : "text-red-400"
                    }`}
                  >
                    {codeMsg}
                  </p>
                )}
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-dw-muted">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartSubtotal)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-dw-lime">
                      <span>Discount ({discountPercent}%)</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-dw-muted">
                    <span>Shipping</span>
                    <span>
                      {cartSubtotal >= 75
                        ? "Free"
                        : formatPrice(8.99)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        total + (cartSubtotal >= 75 ? 0 : 8.99)
                      )}
                    </span>
                  </div>
                </div>
                <ButtonLink
                  href="/checkout"
                  className="mt-6 w-full"
                  size="lg"
                >
                  Checkout
                </ButtonLink>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
