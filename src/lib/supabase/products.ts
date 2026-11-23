import type { Product, ProductCategory, ProductType } from "@/types";
import { getSupabase, isSupabaseConfigured } from "./client";
import { slugify } from "@/lib/utils";

export type DbProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  type: string;
  price: number;
  sale_price: number | null;
  description: string;
  benefits: string[] | null;
  specifications: Record<string, string> | null;
  images: string[] | null;
  rating: number;
  review_count: number;
  stock: number;
  featured: boolean;
  best_seller: boolean;
  is_new: boolean;
  variation_label: string | null;
  variation_options: string[] | null;
  created_at: string;
};

export function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category as ProductCategory,
    brand: row.brand,
    type: row.type as ProductType,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    description: row.description,
    benefits: row.benefits ?? [],
    specifications: row.specifications ?? {},
    images: row.images?.length ? row.images : ["/placeholder-product.jpg"],
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    featured: row.featured,
    bestSeller: row.best_seller,
    isNew: row.is_new,
    variations:
      row.variation_label && row.variation_options?.length
        ? { label: row.variation_label, options: row.variation_options }
        : undefined,
    createdAt: row.created_at,
  };
}

function toDbPayload(data: Omit<Product, "id" | "slug" | "createdAt"> & { slug?: string }) {
  return {
    name: data.name,
    slug: data.slug ?? slugify(data.name),
    category: data.category,
    brand: data.brand,
    type: data.type,
    price: data.price,
    sale_price: data.salePrice ?? null,
    description: data.description,
    benefits: data.benefits,
    specifications: data.specifications,
    images: data.images,
    rating: data.rating,
    review_count: data.reviewCount,
    stock: data.stock,
    featured: data.featured,
    best_seller: data.bestSeller,
    is_new: data.isNew,
    variation_label: data.variations?.label ?? null,
    variation_options: data.variations?.options ?? [],
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function createProduct(
  data: Omit<Product, "id" | "slug" | "createdAt">
): Promise<Product> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const payload = toDbPayload(data);
  const { data: row, error } = await supabase
    .from("products")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapDbProduct(row as DbProduct);
}

export async function updateProductById(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const payload: Record<string, unknown> = {};
  if (data.name !== undefined) {
    payload.name = data.name;
    payload.slug = slugify(data.name);
  }
  if (data.category !== undefined) payload.category = data.category;
  if (data.brand !== undefined) payload.brand = data.brand;
  if (data.type !== undefined) payload.type = data.type;
  if (data.price !== undefined) payload.price = data.price;
  if (data.salePrice !== undefined) payload.sale_price = data.salePrice ?? null;
  if (data.description !== undefined) payload.description = data.description;
  if (data.benefits !== undefined) payload.benefits = data.benefits;
  if (data.specifications !== undefined)
    payload.specifications = data.specifications;
  if (data.images !== undefined) payload.images = data.images;
  if (data.rating !== undefined) payload.rating = data.rating;
  if (data.reviewCount !== undefined) payload.review_count = data.reviewCount;
  if (data.stock !== undefined) payload.stock = data.stock;
  if (data.featured !== undefined) payload.featured = data.featured;
  if (data.bestSeller !== undefined) payload.best_seller = data.bestSeller;
  if (data.isNew !== undefined) payload.is_new = data.isNew;
  if (data.variations !== undefined) {
    payload.variation_label = data.variations?.label ?? null;
    payload.variation_options = data.variations?.options ?? [];
  }

  const { data: row, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapDbProduct(row as DbProduct);
}

export async function deleteProductById(id: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export { isSupabaseConfigured };
