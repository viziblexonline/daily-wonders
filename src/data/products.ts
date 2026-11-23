import { Product, Review, Order } from "@/types";

export const categories = [
  {
    name: "Whey Protein",
    slug: "whey-protein",
    description: "Pure protein for muscle growth & recovery",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
  },
  {
    name: "Pre-Workout",
    slug: "pre-workout",
    description: "Explosive energy for every training session",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
  },
  {
    name: "Creatine",
    slug: "creatine",
    description: "Strength, power, and lean mass support",
    image:
      "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=800&q=80",
  },
  {
    name: "Mass Gainer",
    slug: "mass-gainer",
    description: "High-calorie formulas for hard gainers",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=800&q=80",
  },
  {
    name: "Amino & BCAA",
    slug: "amino-bcaa",
    description: "Intra-workout recovery & hydration",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
  },
  {
    name: "Vitamins & Wellness",
    slug: "vitamins-wellness",
    description: "Daily health for peak performance",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=800&q=80",
  },
] as const;

export const brands = [
  "Daily Wonders",
  "Forge Labs",
  "Peak Form",
  "Iron Pulse",
  "Aether Athletics",
];

export const initialProducts: Product[] = [
  {
    id: "p1",
    name: "Whey Isolate Pro 2kg",
    slug: "whey-isolate-pro-2kg",
    category: "Whey Protein",
    brand: "Daily Wonders",
    type: "Protein",
    price: 64.99,
    salePrice: 49.99,
    description:
      "Ultra-filtered whey isolate delivering 27g of pure protein per serving with minimal carbs and fat. Designed for rapid absorption post-training.",
    benefits: [
      "27g protein per scoop",
      "Low lactose formula",
      "Fast absorption",
      "25 servings per tub",
    ],
    specifications: {
      Weight: "2kg",
      Protein: "27g / serving",
      Servings: "25",
    },
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
      "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=800&q=80",
    ],
    rating: 4.8,
    reviewCount: 342,
    stock: 120,
    featured: true,
    bestSeller: true,
    isNew: false,
    variations: {
      label: "Flavor",
      options: ["Chocolate", "Vanilla", "Strawberry", "Cookies & Cream"],
    },
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "p2",
    name: "Nitro Charge Pre-Workout",
    slug: "nitro-charge-pre-workout",
    category: "Pre-Workout",
    brand: "Forge Labs",
    type: "Pre-Workout",
    price: 39.99,
    salePrice: 29.99,
    description:
      "Clinically dosed pre-workout with caffeine, citrulline, and beta-alanine for explosive energy, focus, and pumps.",
    benefits: [
      "300mg caffeine",
      "6g L-Citrulline",
      "Intense focus blend",
      "Zero crash formula",
    ],
    specifications: {
      Servings: "30",
      Caffeine: "300mg",
      Form: "Powder",
    },
    images: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    ],
    rating: 4.7,
    reviewCount: 218,
    stock: 85,
    featured: true,
    bestSeller: true,
    isNew: true,
    variations: {
      label: "Flavor",
      options: ["Fruit Punch", "Blue Raspberry", "Watermelon"],
    },
    createdAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "p3",
    name: "Creatine Monohydrate 500g",
    slug: "creatine-monohydrate-500g",
    category: "Creatine",
    brand: "Forge Labs",
    type: "Creatine",
    price: 29.99,
    description:
      "Micronized creatine monohydrate for strength, power, and lean mass. Pure, unflavored, and laboratory tested.",
    benefits: [
      "5g pure creatine per serving",
      "Micronized for mixability",
      "100 servings",
      "Third-party tested",
    ],
    specifications: {
      Weight: "500g",
      Servings: "100",
      Form: "Micronized powder",
    },
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=800&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    ],
    rating: 4.9,
    reviewCount: 412,
    stock: 220,
    featured: false,
    bestSeller: true,
    isNew: false,
    createdAt: "2025-05-15T00:00:00Z",
  },
  {
    id: "p4",
    name: "Mass Gainer Extreme 3kg",
    slug: "mass-gainer-extreme-3kg",
    category: "Mass Gainer",
    brand: "Forge Labs",
    type: "Gainer",
    price: 54.99,
    description:
      "High-calorie mass gainer with complex carbs and protein for hard gainers looking to pack on size.",
    benefits: [
      "50g protein per serving",
      "Complex carb blend",
      "Added creatine",
      "20 servings",
    ],
    specifications: {
      Weight: "3kg",
      Protein: "50g / serving",
      Calories: "650 / serving",
    },
    images: [
      "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=800&q=80",
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    ],
    rating: 4.3,
    reviewCount: 84,
    stock: 55,
    featured: false,
    bestSeller: false,
    isNew: false,
    variations: {
      label: "Flavor",
      options: ["Chocolate", "Vanilla"],
    },
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "p5",
    name: "BCAA Hydration Formula",
    slug: "bcaa-hydration-formula",
    category: "Amino & BCAA",
    brand: "Daily Wonders",
    type: "Amino",
    price: 32.99,
    salePrice: 26.99,
    description:
      "2:1:1 BCAA blend with electrolytes for intra-workout hydration and muscle recovery support.",
    benefits: [
      "7g BCAAs per serving",
      "Electrolyte complex",
      "Sugar-free",
      "30 servings",
    ],
    specifications: {
      Servings: "30",
      Ratio: "2:1:1 BCAA",
      Form: "Powder",
    },
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 98,
    stock: 70,
    featured: true,
    bestSeller: false,
    isNew: true,
    variations: {
      label: "Flavor",
      options: ["Lemon Lime", "Mango", "Grape"],
    },
    createdAt: "2025-11-05T00:00:00Z",
  },
  {
    id: "p6",
    name: "Focus Nootropic Capsules",
    slug: "focus-nootropic-capsules",
    category: "Pre-Workout",
    brand: "Forge Labs",
    type: "Pre-Workout",
    price: 44.99,
    description:
      "Caffeine-free focus formula with lion's mane, L-theanine, and bacopa for clean mental clarity during training.",
    benefits: [
      "Caffeine-free",
      "Lion's Mane extract",
      "L-Theanine + Bacopa",
      "60 capsules",
    ],
    specifications: {
      Servings: "30",
      Form: "Capsules",
      Stimulants: "None",
    },
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=800&q=80",
      "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=800&q=80",
    ],
    rating: 4.4,
    reviewCount: 67,
    stock: 60,
    featured: true,
    bestSeller: false,
    isNew: true,
    createdAt: "2025-11-08T00:00:00Z",
  },
  {
    id: "p7",
    name: "Whey Concentrate Classic 1kg",
    slug: "whey-concentrate-classic-1kg",
    category: "Whey Protein",
    brand: "Peak Form",
    type: "Protein",
    price: 39.99,
    salePrice: 32.99,
    description:
      "Everyday whey concentrate with 24g protein per scoop. Smooth mix, great taste, solid value.",
    benefits: [
      "24g protein per scoop",
      "Great mixability",
      "30 servings",
      "Budget friendly",
    ],
    specifications: {
      Weight: "1kg",
      Protein: "24g / serving",
      Servings: "30",
    },
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
    ],
    rating: 4.6,
    reviewCount: 190,
    stock: 140,
    featured: false,
    bestSeller: true,
    isNew: false,
    variations: {
      label: "Flavor",
      options: ["Chocolate", "Vanilla", "Banana"],
    },
    createdAt: "2025-07-01T00:00:00Z",
  },
  {
    id: "p8",
    name: "Daily Multivitamin Athlete",
    slug: "daily-multivitamin-athlete",
    category: "Vitamins & Wellness",
    brand: "Daily Wonders",
    type: "Vitamin",
    price: 24.99,
    description:
      "Athlete-focused multivitamin with vitamin D, zinc, magnesium, and B-complex for daily performance support.",
    benefits: [
      "Full spectrum vitamins",
      "Zinc + Magnesium",
      "60 tablets",
      "Once daily",
    ],
    specifications: {
      Servings: "60",
      Form: "Tablets",
    },
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=800&q=80",
    ],
    rating: 4.5,
    reviewCount: 112,
    stock: 200,
    featured: false,
    bestSeller: false,
    isNew: true,
    createdAt: "2025-11-10T00:00:00Z",
  },
];

export const initialReviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Marcus T.",
    rating: 5,
    comment:
      "Best whey I've used. Mixes clean, tastes great, and recovery feels noticeably better.",
    date: "2025-10-12",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Sarah K.",
    rating: 5,
    comment: "Chocolate flavor is unreal. No bloating at all.",
    date: "2025-09-28",
  },
  {
    id: "r3",
    productId: "p2",
    author: "Diego R.",
    rating: 5,
    comment: "Insane pumps and focus. My go-to before every session.",
    date: "2025-11-01",
  },
  {
    id: "r4",
    productId: "p3",
    author: "Emma L.",
    rating: 5,
    comment: "Pure creatine, mixes well, noticeable strength gains.",
    date: "2025-08-15",
  },
];

export const initialOrders: Order[] = [
  {
    id: "ORD-1001",
    items: [
      {
        productId: "p1",
        quantity: 2,
        variation: "Chocolate",
        name: "Whey Isolate Pro 2kg",
        price: 49.99,
        image:
          "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80",
      },
    ],
    total: 99.98,
    status: "processing",
    customerName: "Alex Rivera",
    email: "alex@example.com",
    createdAt: "2025-11-15T10:00:00Z",
  },
];

export const testimonials = [
  {
    name: "Marcus Rivera",
    role: "Competitive Lifter",
    quote:
      "Daily Wonders supplements feel clinical-grade. Protein quality you can trust every single day.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef0754ff07?w=200&q=80",
  },
  {
    name: "Aisha Rahman",
    role: "HIIT Coach",
    quote:
      "From whey to pre-workout, everything here fuels my sessions. Clean formulas, fast shipping.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&q=80",
  },
  {
    name: "Tom Brennan",
    role: "CrossFit Athlete",
    quote:
      "My go-to supplement store. Creatine and BCAAs that actually deliver.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&q=80",
  },
];

export const instagramImages = [
  "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
  "https://images.unsplash.com/photo-1579722820308-d74e57ce3e79?w=600&q=80",
  "https://images.unsplash.com/photo-1550572017-edd951aa8ca6?w=600&q=80",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
];
