"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { useState } from "react";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
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

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/70 animate-fade-in"
        onClick={() => setCartOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-dw-charcoal animate-slide-in-right">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-dw-lime" />
            <h2 className="font-display text-xl tracking-widest">YOUR BAG</h2>
          </div>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center hover:text-dw-lime"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag size={40} className="text-dw-muted" />
              <p className="text-dw-muted">Your bag is empty</p>
              <Button
                variant="primary"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                const price = product.salePrice ?? product.price;
                return (
                  <li
                    key={`${item.productId}-${item.variation ?? ""}`}
                    className="flex gap-4"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setCartOpen(false)}
                      className="relative h-24 w-20 shrink-0 overflow-hidden bg-dw-surface"
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="text-sm font-medium hover:text-dw-lime"
                          >
                            {product.name}
                          </Link>
                          {item.variation && (
                            <p className="mt-0.5 text-xs text-dw-muted">
                              {product.variations?.label}: {item.variation}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label="Remove"
                          onClick={() =>
                            removeFromCart(item.productId, item.variation)
                          }
                          className="text-dw-muted hover:text-white"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-white/15">
                          <button
                            type="button"
                            aria-label="Decrease"
                            className="flex h-8 w-8 items-center justify-center hover:bg-white/5"
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
                            aria-label="Increase"
                            className="flex h-8 w-8 items-center justify-center hover:bg-white/5"
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
                        <span className="text-sm font-semibold">
                          {formatPrice(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-4">
            <div className="flex gap-2">
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
                className={`text-xs ${
                  discountPercent > 0 ? "text-dw-lime" : "text-red-400"
                }`}
              >
                {codeMsg}
              </p>
            )}
            <div className="space-y-2 text-sm">
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
              <div className="flex justify-between text-base font-semibold">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <ButtonLink href="/cart" variant="outline" className="w-full" size="md">
              View Cart
            </ButtonLink>
            <ButtonLink href="/checkout" variant="primary" className="w-full" size="md">
              Checkout
            </ButtonLink>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-xs uppercase tracking-widest text-dw-muted hover:text-white"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
