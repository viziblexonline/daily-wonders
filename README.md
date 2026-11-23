# Daily Wonders

Premium **Protein & Supplements** e-commerce store.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS v4
- Supabase (products DB + image storage)
- Admin panel at `/admin`

## Setup

### 1. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 2. Connect Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste and run `supabase/schema.sql`
3. Copy Project URL + anon key from **Settings → API**
4. Put them in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

5. Restart `npm run dev`

Admin status shows **Supabase connected** when keys are valid.

### 3. Add products

Go to **http://localhost:3000/admin**

- Add / edit / delete supplements
- Upload images (stored in Supabase `product-images` bucket)
- Set price, sale price, stock, featured, best seller

## Categories (supplements only)

- Whey Protein
- Pre-Workout
- Creatine
- Mass Gainer
- Amino & BCAA
- Vitamins & Wellness

## Discount codes

`WONDERS10` · `STRENGTH15` · `LEVELUP20`
