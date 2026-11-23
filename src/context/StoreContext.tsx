"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialOrders,
  initialProducts,
  initialReviews,
} from "@/data/products";
import type { CartItem, Order, Product, Review } from "@/types";
import { slugify } from "@/lib/utils";
import {
  createProduct as sbCreate,
  deleteProductById as sbDelete,
  fetchProducts,
  isSupabaseConfigured,
  updateProductById as sbUpdate,
  uploadProductImage,
} from "@/lib/supabase/products";

const CART_KEY = "dw_cart";
const WISHLIST_KEY = "dw_wishlist";
const ORDERS_KEY = "dw_orders";
const LOCAL_PRODUCTS_KEY = "dw_products_local";

interface StoreContextValue {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  reviews: Review[];
  cartOpen: boolean;
  searchOpen: boolean;
  hydrated: boolean;
  loadingProducts: boolean;
  supabaseReady: boolean;
  productsError: string | null;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, quantity?: number, variation?: string) => void;
  removeFromCart: (productId: string, variation?: string) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    variation?: string
  ) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getProduct: (idOrSlug: string) => Product | undefined;
  addProduct: (
    product: Omit<Product, "id" | "slug" | "createdAt">
  ) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  refreshProducts: () => Promise<void>;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  applyDiscount: (code: string) => number;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  discountPercent: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews] = useState<Review[]>(initialReviews);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      if (isSupabaseConfigured) {
        const remote = await fetchProducts();
        if (remote.length > 0) {
          setProducts(remote);
        } else {
          // Empty DB — keep seed so storefront isn't blank
          setProducts(initialProducts);
        }
      } else {
        const local = loadJSON<Product[]>(LOCAL_PRODUCTS_KEY, initialProducts);
        setProducts(local);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load products";
      setProductsError(msg);
      setProducts(initialProducts);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    setCart(loadJSON(CART_KEY, []));
    setWishlist(loadJSON(WISHLIST_KEY, []));
    setOrders(loadJSON(ORDERS_KEY, initialOrders));
    setHydrated(true);
    void refreshProducts();
  }, [refreshProducts]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated || isSupabaseConfigured) return;
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  }, [products, hydrated]);

  const getProduct = useCallback(
    (idOrSlug: string) =>
      products.find((p) => p.id === idOrSlug || p.slug === idOrSlug),
    [products]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      const price = product.salePrice ?? product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart, products]);

  const addToCart = useCallback(
    (productId: string, quantity = 1, variation?: string) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.productId === productId && i.variation === variation
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === productId && i.variation === variation
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { productId, quantity, variation }];
      });
      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((productId: string, variation?: string) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variation === variation)
      )
    );
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number, variation?: string) => {
      if (quantity <= 0) {
        removeFromCart(productId, variation);
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.variation === variation
            ? { ...i, quantity }
            : i
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const addProduct = useCallback(
    async (data: Omit<Product, "id" | "slug" | "createdAt">) => {
      if (isSupabaseConfigured) {
        const created = await sbCreate(data);
        setProducts((prev) => [created, ...prev]);
        return;
      }
      const id = `p${Date.now()}`;
      const product: Product = {
        ...data,
        id,
        slug: slugify(data.name),
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [product, ...prev]);
    },
    []
  );

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    if (isSupabaseConfigured) {
      const updated = await sbUpdate(id, data);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return;
    }
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, ...data };
        if (data.name) updated.slug = slugify(data.name);
        return updated;
      })
    );
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    if (isSupabaseConfigured) {
      await sbDelete(id);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((i) => i.productId !== id));
    setWishlist((prev) => prev.filter((wid) => wid !== id));
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    if (isSupabaseConfigured) {
      return uploadProductImage(file);
    }
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }, []);

  const updateOrderStatus = useCallback((id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  const applyDiscount = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const codes: Record<string, number> = {
      WONDERS10: 10,
      STRENGTH15: 15,
      LEVELUP20: 20,
    };
    const percent = codes[normalized] ?? 0;
    setDiscountCode(normalized);
    setDiscountPercent(percent);
    return percent;
  }, []);

  const value: StoreContextValue = {
    products,
    cart,
    wishlist,
    orders,
    reviews,
    cartOpen,
    searchOpen,
    hydrated,
    loadingProducts,
    supabaseReady: isSupabaseConfigured,
    productsError,
    setCartOpen,
    setSearchOpen,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    isInWishlist,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    refreshProducts,
    updateOrderStatus,
    applyDiscount,
    discountCode,
    setDiscountCode,
    discountPercent,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
