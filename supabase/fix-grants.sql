-- Run this in Supabase SQL Editor to fix product permissions

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.products to anon, authenticated;

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

-- Storage for images
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
