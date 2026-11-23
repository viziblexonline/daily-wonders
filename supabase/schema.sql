-- Daily Wonders — Protein & Supplements schema
-- Run this in Supabase SQL Editor

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  brand text not null default 'Daily Wonders',
  type text not null default 'Protein',
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  description text not null default '',
  benefits text[] not null default '{}',
  specifications jsonb not null default '{}'::jsonb,
  images text[] not null default '{}',
  rating numeric(3,2) not null default 4.5,
  review_count integer not null default 0,
  stock integer not null default 0,
  featured boolean not null default false,
  best_seller boolean not null default false,
  is_new boolean not null default true,
  variation_label text,
  variation_options text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_slug_idx on public.products (slug);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- Table privileges for API roles
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.products to anon, authenticated;

-- RLS: public read, anon write for admin (tighten later with auth)
alter table public.products enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

drop policy if exists "Public insert products" on public.products;
create policy "Public insert products"
  on public.products for insert
  with check (true);

drop policy if exists "Public update products" on public.products;
create policy "Public update products"
  on public.products for update
  using (true);

drop policy if exists "Public delete products" on public.products;
create policy "Public delete products"
  on public.products for delete
  using (true);

-- Storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Public upload product images" on storage.objects;
create policy "Public upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images');

drop policy if exists "Public update product images" on storage.objects;
create policy "Public update product images"
  on storage.objects for update
  using (bucket_id = 'product-images');

drop policy if exists "Public delete product images" on storage.objects;
create policy "Public delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images');
