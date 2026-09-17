-- ============================================================================
-- Pascaqueen Herbal — Supabase schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).
-- Safe to re-run any time — every statement is idempotent.
-- ============================================================================

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  price numeric(12,2) not null default 0,
  category text default '',
  image_url text default '',
  ingredients text default '',
  directions text default '',
  warnings text default '',
  variants jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- If you ran an earlier version of this schema, add the new columns now.
alter table public.products add column if not exists ingredients text default '';
alter table public.products add column if not exists directions text default '';
alter table public.products add column if not exists warnings text default '';
alter table public.products add column if not exists variants jsonb not null default '[]';

alter table public.products enable row level security;

drop policy if exists "Public can view products" on public.products;
drop policy if exists "Admin can insert products" on public.products;
drop policy if exists "Admin can update products" on public.products;
drop policy if exists "Admin can delete products" on public.products;

-- Anyone (including anonymous shoppers) can view products.
create policy "Public can view products"
  on public.products for select
  using (true);

-- Only the admin account can add, edit, or delete products.
create policy "Admin can insert products"
  on public.products for insert
  with check (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can update products"
  on public.products for update
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can delete products"
  on public.products for delete
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

-- ----------------------------------------------------------------------------
-- ORDERS  (created automatically when a shopper checks out via WhatsApp)
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null default '[]',
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

-- If you ran an earlier version of this schema without user_id, add it now.
alter table public.orders add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.orders enable row level security;

drop policy if exists "Anyone can create an order" on public.orders;
drop policy if exists "Admin can view orders" on public.orders;
drop policy if exists "Users can view their own orders" on public.orders;

-- Any visitor (signed in or not) can create an order record at checkout.
create policy "Anyone can create an order"
  on public.orders for insert
  with check (true);

-- The admin can read all order history (for analytics).
create policy "Admin can view orders"
  on public.orders for select
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

-- Signed-in customers can view their own past orders.
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- PAGE VIEWS  (feeds the admin's real-time analytics)
-- ----------------------------------------------------------------------------
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  created_at timestamptz not null default now()
);

alter table public.page_views enable row level security;

drop policy if exists "Anyone can log a page view" on public.page_views;
drop policy if exists "Admin can view page views" on public.page_views;

create policy "Anyone can log a page view"
  on public.page_views for insert
  with check (true);

create policy "Admin can view page views"
  on public.page_views for select
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

-- ----------------------------------------------------------------------------
-- TESTIMONIALS  (admin-managed customer reviews shown on the storefront)
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  quote text not null,
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can view published testimonials" on public.testimonials;
drop policy if exists "Admin can view all testimonials" on public.testimonials;
drop policy if exists "Admin can insert testimonials" on public.testimonials;
drop policy if exists "Admin can update testimonials" on public.testimonials;
drop policy if exists "Admin can delete testimonials" on public.testimonials;

-- Shoppers only see published testimonials.
create policy "Public can view published testimonials"
  on public.testimonials for select
  using (is_published = true);

-- The admin can see, add, edit, and delete all testimonials (including drafts).
create policy "Admin can view all testimonials"
  on public.testimonials for select
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can insert testimonials"
  on public.testimonials for insert
  with check (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can update testimonials"
  on public.testimonials for update
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can delete testimonials"
  on public.testimonials for delete
  using (auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

-- ----------------------------------------------------------------------------
-- REALTIME
-- Enable realtime replication so the admin dashboard updates live.
-- Wrapped so re-running this script never errors if a table is already added.
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'page_views'
  ) then
    alter publication supabase_realtime add table public.page_views;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'testimonials'
  ) then
    alter publication supabase_realtime add table public.testimonials;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- STORAGE — product photo uploads
-- Create the bucket in the dashboard (Storage → New bucket → "product-images",
-- Public bucket = ON) OR run this if your project allows it via SQL:
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Admin can upload product images" on storage.objects;
drop policy if exists "Admin can update product images" on storage.objects;
drop policy if exists "Admin can delete product images" on storage.objects;

-- Public read access to product photos
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Only the admin can upload/replace/delete product photos
create policy "Admin can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

create policy "Admin can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.jwt() ->> 'email' = 'samuelivere92@gmail.com');

-- ============================================================================
-- FINAL STEP: create the admin user
-- Go to Authentication → Users → Add user in the Supabase dashboard and
-- create an account with the email samuelivere92@gmail.com and a password
-- of your choice. That email is the ONLY account the RLS policies above (and
-- the app's own admin check) will treat as an administrator.
-- ============================================================================
