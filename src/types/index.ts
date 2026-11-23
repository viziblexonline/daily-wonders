export type ProductCategory =
  | "Whey Protein"
  | "Pre-Workout"
  | "Creatine"
  | "Mass Gainer"
  | "Amino & BCAA"
  | "Vitamins & Wellness";

export type ProductType = "Protein" | "Pre-Workout" | "Creatine" | "Gainer" | "Amino" | "Vitamin";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  type: ProductType;
  price: number;
  salePrice?: number;
  description: string;
  benefits: string[];
  specifications: Record<string, string>;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  isNew: boolean;
  variations?: {
    label: string;
    options: string[];
  };
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  variation?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  items: (CartItem & { name: string; price: number; image: string })[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customerName: string;
  email: string;
  createdAt: string;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling";
