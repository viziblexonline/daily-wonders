"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function CheckoutPage() {
  const { cart, products, cartSubtotal, clearCart, discountPercent } =
    useStore();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const discount = (cartSubtotal * discountPercent) / 100;
  const shipping = cartSubtotal >= 75 ? 0 : 8.99;
  const total = cartSubtotal - discount + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) return;
    setSubmitted(true);
    clearCart();
  };

  if (cart.length === 0 && !submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-24">
        <p className="text-dw-muted">Your bag is empty</p>
        <ButtonLink href="/shop">Shop Now</ButtonLink>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-24 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-dw-lime">
          Order Confirmed
        </p>
        <h1 className="font-display text-5xl tracking-wider">
          THANKS, {form.name.split(" ")[0].toUpperCase()}!
        </h1>
        <p className="max-w-md text-dw-muted">
          Your order is confirmed. A receipt will be sent to {form.email}.
        </p>
        <Button onClick={() => router.push("/shop")} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <h1 className="font-display text-5xl tracking-wider">CHECKOUT</h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 lg:col-span-7"
          >
            <h2 className="font-display text-2xl tracking-widest">
              SHIPPING DETAILS
            </h2>
            {(
              [
                ["name", "Full name", "text"],
                ["email", "Email", "email"],
                ["address", "Address", "text"],
                ["city", "City", "text"],
                ["zip", "ZIP / Postal code", "text"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key}>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
                  {label}
                </label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [key]: e.target.value }))
                  }
                  className="h-12 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
                />
              </div>
            ))}
            <Button type="submit" size="lg" className="mt-4 w-full sm:w-auto">
              Place Order · {formatPrice(total)}
            </Button>
          </form>

          <aside className="lg:col-span-5">
            <div className="border border-white/10 bg-dw-charcoal p-6">
              <h2 className="font-display text-2xl tracking-widest">
                YOUR ORDER
              </h2>
              <ul className="mt-5 space-y-3">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;
                  const price = product.salePrice ?? product.price;
                  return (
                    <li
                      key={`${item.productId}-${item.variation}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <span className="text-dw-soft">
                        {product.name} × {item.quantity}
                        {item.variation ? ` (${item.variation})` : ""}
                      </span>
                      <span>{formatPrice(price * item.quantity)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
                <div className="flex justify-between text-dw-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-dw-lime">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-dw-muted">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
