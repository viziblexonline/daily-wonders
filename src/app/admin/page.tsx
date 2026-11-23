"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Database,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/Button";
import { formatPrice, cn } from "@/lib/utils";
import type { Order, Product, ProductCategory, ProductType } from "@/types";

type Tab = "products" | "orders" | "add";

const CATEGORIES: ProductCategory[] = [
  "Whey Protein",
  "Pre-Workout",
  "Creatine",
  "Mass Gainer",
  "Amino & BCAA",
  "Vitamins & Wellness",
];

const TYPES: ProductType[] = [
  "Protein",
  "Pre-Workout",
  "Creatine",
  "Gainer",
  "Amino",
  "Vitamin",
];

const emptyForm = {
  name: "",
  category: "Whey Protein" as ProductCategory,
  brand: "Daily Wonders",
  type: "Protein" as ProductType,
  price: "",
  salePrice: "",
  description: "",
  benefits: "",
  stock: "50",
  featured: false,
  bestSeller: false,
  isNew: true,
  images: "",
  rating: "4.5",
  reviewCount: "0",
  variationLabel: "Flavor",
  variationOptions: "Chocolate, Vanilla",
};

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    uploadImage,
    refreshProducts,
    loadingProducts,
    supabaseReady,
    productsError,
  } = useStore();
  const [tab, setTab] = useState<Tab>("products");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }, [products, search]);

  const loadProduct = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      brand: p.brand,
      type: p.type,
      price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : "",
      description: p.description,
      benefits: p.benefits.join("\n"),
      stock: String(p.stock),
      featured: p.featured,
      bestSeller: p.bestSeller,
      isNew: p.isNew,
      images: p.images.join("\n"),
      rating: String(p.rating),
      reviewCount: String(p.reviewCount),
      variationLabel: p.variations?.label ?? "Flavor",
      variationOptions: p.variations?.options.join(", ") ?? "",
    });
    setTab("add");
    setMessage("");
    setError("");
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file));
      }
      setForm((f) => ({
        ...f,
        images: [f.images, ...urls].filter(Boolean).join("\n"),
      }));
      setMessage(
        supabaseReady
          ? "Images uploaded to Supabase Storage."
          : "Images attached (local mode)."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!form.name || !form.price || images.length === 0) {
      setError("Name, price, and at least one image are required.");
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      brand: form.brand,
      type: form.type,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : undefined,
      description: form.description || "Premium Daily Wonders supplement.",
      benefits: form.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specifications: {
        Brand: form.brand,
        Category: form.category,
        Type: form.type,
      },
      images,
      rating: Number(form.rating) || 4.5,
      reviewCount: Number(form.reviewCount) || 0,
      stock: Number(form.stock) || 0,
      featured: form.featured,
      bestSeller: form.bestSeller,
      isNew: form.isNew,
      variations:
        form.variationLabel && form.variationOptions
          ? {
              label: form.variationLabel,
              options: form.variationOptions
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            }
          : undefined,
    };

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage("Product updated" + (supabaseReady ? " in Supabase." : "."));
      } else {
        await addProduct(payload);
        setMessage("Product added" + (supabaseReady ? " to Supabase." : "."));
      }
      setForm(emptyForm);
      setEditingId(null);
      setTab("products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-dw-black pt-24 pb-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-dw-lime">
              Dashboard
            </p>
            <h1 className="mt-2 font-display text-5xl tracking-wider">
              ADMIN PANEL
            </h1>
            <p className="mt-2 text-sm text-dw-muted">
              Manage Protein &amp; Supplements products only.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div
              className={cn(
                "flex items-center gap-2",
                supabaseReady ? "text-dw-lime" : "text-amber-400"
              )}
            >
              <Database size={16} />
              {supabaseReady ? "Supabase connected" : "Local mode (add .env.local)"}
            </div>
            <div className="flex items-center gap-2 text-dw-muted">
              <Package size={16} className="text-dw-lime" />
              {products.length} products
            </div>
            <div className="flex items-center gap-2 text-dw-muted">
              <ShoppingBag size={16} className="text-dw-lime" />
              {orders.length} orders
            </div>
          </div>
        </div>

        {!supabaseReady && (
          <div className="mt-6 border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            Supabase keys missing. Create <code className="text-dw-lime">.env.local</code> with
            your project URL + anon key, run <code className="text-dw-lime">supabase/schema.sql</code>{" "}
            in the SQL Editor, then restart the server. Until then, admin still works locally.
          </div>
        )}

        {(message || error || productsError) && (
          <p
            className={cn(
              "mt-4 text-sm",
              error || productsError ? "text-red-400" : "text-dw-lime"
            )}
          >
            {error || productsError || message}
          </p>
        )}

        <div className="mt-8 flex gap-2 border-b border-white/10">
          {(
            [
              ["products", "Products"],
              ["add", editingId ? "Edit Product" : "Add Supplement"],
              ["orders", "Orders"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (key === "add" && tab !== "add") {
                  setEditingId(null);
                  setForm(emptyForm);
                }
                setTab(key);
                setMessage("");
                setError("");
              }}
              className={cn(
                "border-b-2 px-4 pb-3 text-xs uppercase tracking-widest",
                tab === key
                  ? "border-dw-lime text-dw-lime"
                  : "border-transparent text-dw-muted hover:text-white"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div className="mt-8">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search supplements..."
                className="h-11 w-full max-w-md border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => void refreshProducts()}
                  disabled={loadingProducts}
                >
                  <RefreshCw size={14} className={loadingProducts ? "animate-spin" : ""} />
                  Refresh
                </Button>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                    setTab("add");
                  }}
                >
                  <Plus size={16} /> Add Supplement
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto border border-white/10">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-dw-charcoal text-xs uppercase tracking-widest text-dw-muted">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Flags</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-10 overflow-hidden bg-dw-surface">
                            <Image
                              src={p.images[0]}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                              unoptimized={
                                p.images[0]?.startsWith("data:") ||
                                p.images[0]?.includes("supabase")
                              }
                            />
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-dw-muted">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-dw-muted">{p.category}</td>
                      <td className="p-4">
                        {p.salePrice ? (
                          <span>
                            <span className="text-dw-lime">
                              {formatPrice(p.salePrice)}
                            </span>
                            <span className="ml-2 text-xs text-dw-muted line-through">
                              {formatPrice(p.price)}
                            </span>
                          </span>
                        ) : (
                          formatPrice(p.price)
                        )}
                      </td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && (
                            <span className="bg-dw-lime/20 px-1.5 py-0.5 text-[10px] text-dw-lime">
                              Featured
                            </span>
                          )}
                          {p.bestSeller && (
                            <span className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                              Best Seller
                            </span>
                          )}
                          {p.isNew && (
                            <span className="bg-white/10 px-1.5 py-0.5 text-[10px]">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={() => loadProduct(p)}
                            className="flex h-9 w-9 items-center justify-center border border-white/15 hover:border-dw-lime hover:text-dw-lime"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={async () => {
                              if (!confirm(`Delete "${p.name}"?`)) return;
                              try {
                                await deleteProduct(p.id);
                                setMessage("Product deleted.");
                              } catch (err) {
                                setError(
                                  err instanceof Error
                                    ? err.message
                                    : "Delete failed"
                                );
                              }
                            }}
                            className="flex h-9 w-9 items-center justify-center border border-white/15 hover:border-red-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "add" && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2"
          >
            <div className="md:col-span-2 flex items-center justify-between">
              <h2 className="font-display text-2xl tracking-widest">
                {editingId ? "EDIT SUPPLEMENT" : "ADD SUPPLEMENT"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="flex items-center gap-1 text-xs text-dw-muted hover:text-white"
                >
                  <X size={14} /> Cancel edit
                </button>
              )}
            </div>

            <Field label="Product name">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
                placeholder="Whey Isolate Pro 2kg"
              />
            </Field>
            <Field label="Brand">
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ProductCategory,
                  })
                }
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Product type">
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as ProductType })
                }
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price ($)">
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Sale price ($) — optional">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.salePrice}
                onChange={(e) =>
                  setForm({ ...form, salePrice: e.target.value })
                }
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Rating">
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border border-white/15 bg-dw-charcoal px-4 py-3 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field label="Benefits (one per line)" className="md:col-span-2">
              <textarea
                rows={3}
                value={form.benefits}
                onChange={(e) =>
                  setForm({ ...form, benefits: e.target.value })
                }
                className="w-full border border-white/15 bg-dw-charcoal px-4 py-3 text-sm outline-none focus:border-dw-lime"
              />
            </Field>
            <Field
              label="Image URLs (one per line) or upload"
              className="md:col-span-2"
            >
              <textarea
                rows={3}
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="w-full border border-white/15 bg-dw-charcoal px-4 py-3 text-sm outline-none focus:border-dw-lime"
                placeholder="https://..."
              />
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={(e) => void handleImageFiles(e.target.files)}
                className="mt-2 block w-full text-sm text-dw-muted file:mr-4 file:border-0 file:bg-dw-lime file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-wider file:text-dw-black"
              />
              {uploading && (
                <p className="mt-2 text-xs text-dw-lime">Uploading...</p>
              )}
            </Field>
            <Field label="Variation label">
              <input
                value={form.variationLabel}
                onChange={(e) =>
                  setForm({ ...form, variationLabel: e.target.value })
                }
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
                placeholder="Flavor"
              />
            </Field>
            <Field label="Variation options (comma-separated)">
              <input
                value={form.variationOptions}
                onChange={(e) =>
                  setForm({ ...form, variationOptions: e.target.value })
                }
                className="h-11 w-full border border-white/15 bg-dw-charcoal px-4 text-sm outline-none focus:border-dw-lime"
                placeholder="Chocolate, Vanilla"
              />
            </Field>
            <div className="md:col-span-2 flex flex-wrap gap-6">
              {(
                [
                  ["featured", "Featured"],
                  ["bestSeller", "Best Seller"],
                  ["isNew", "New Arrival"],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-sm text-dw-soft"
                >
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.checked })
                    }
                    className="accent-dw-lime"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div className="md:col-span-2">
              <Button type="submit" size="lg" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Supplement"}
              </Button>
            </div>
          </form>
        )}

        {tab === "orders" && (
          <div className="mt-8 overflow-x-auto border border-white/10">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-dw-charcoal text-xs uppercase tracking-widest text-dw-muted">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-4">
                      <p className="font-medium">{o.id}</p>
                      <p className="text-xs text-dw-muted">
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p>{o.customerName}</p>
                      <p className="text-xs text-dw-muted">{o.email}</p>
                    </td>
                    <td className="p-4 text-dw-muted">
                      {o.items.map((i) => i.name).join(", ")}
                    </td>
                    <td className="p-4">{formatPrice(o.total)}</td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            o.id,
                            e.target.value as Order["status"]
                          )
                        }
                        className="h-9 border border-white/15 bg-dw-black px-2 text-xs capitalize outline-none focus:border-dw-lime"
                      >
                        {[
                          "pending",
                          "processing",
                          "shipped",
                          "delivered",
                          "cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-dw-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
