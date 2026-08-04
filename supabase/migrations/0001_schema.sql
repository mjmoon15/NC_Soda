-- ============================================================================
-- 0001_schema.sql — New Creation Soda Works
-- Base tables + the anon-safe public_products view.
--
-- The column names here are the CONTRACT consumed by the row mappers in
-- lib/data/index.ts (mapProduct / mapVideo / mapAsset) and the domain types in
-- lib/types.ts. Everything is snake_case; the mappers translate to camelCase.
-- Run order: 0001_schema -> 0002_rls -> 0003_seed.
-- ============================================================================

-- ── profiles ───────────────────────────────────────────────────────────────
-- One row per auth user. Auto-created by the handle_new_user trigger (0002).
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'rep' check (role in ('rep', 'admin')),
  company     text,
  created_at  timestamptz not null default now()
);

-- ── products (FLAT — matches mapProduct in lib/data/index.ts) ────────────────
-- id is text so the seed can reuse the stable mock ids (e.g. 'p_parakey').
create table if not exists public.products (
  id              text primary key,
  slug            text not null unique,
  name            text not null,
  tagline         text,
  description     text,
  category        text not null check (category in ('Craft Soda', 'Sparkling Hopwater', 'Margarita Mix')),
  color           text,
  image_url       text,
  calories        int,
  is_gluten_free  boolean not null default false,
  featured        boolean not null default false,

  -- gated rep-only spec columns (never exposed via public_products) ----------
  sku             text,
  upc             text,
  case_upc        text,
  case_pack       int,
  unit_volume     text,
  net_weight      text,
  abv             text,          -- nullable: hopwater carries '0.0% ABV', soda/marg are null
  ingredients     text,
  shelf_life_days int
);

-- ── videos (matches mapVideo) ────────────────────────────────────────────────
-- Public videos play from YouTube (youtube_id); gated videos stream from
-- Supabase Storage (storage_path) via a server-minted signed URL.
create table if not exists public.videos (
  id               text primary key,
  title            text not null,
  description      text,
  category         text not null check (category in ('brand', 'product', 'training')),
  access           text not null check (access in ('public', 'rep')),
  youtube_id       text,        -- nullable: gated videos use storage_path instead
  storage_path     text,        -- nullable: public videos use youtube_id instead
  thumbnail_url    text,
  duration_seconds int
);

-- ── assets (sell sheets / POS / spec sheets / logos — matches mapAsset) ──────
-- All assets are rep-gated; the app mints signed Storage URLs server-side.
create table if not exists public.assets (
  id           text primary key,
  title        text not null,
  description  text,
  type         text not null check (type in ('sell_sheet', 'pos', 'spec_sheet', 'logo')),
  file_url     text,
  file_type    text,
  size_bytes   bigint,
  product_slug text,                       -- optional link to a product
  access       text not null default 'rep'
);

-- ── public_products VIEW ─────────────────────────────────────────────────────
-- The anon/public catalog read (getProducts / getProduct) selects from this
-- view, NOT the base table — so the storefront never sees sku/upc/case data.
-- Defined WITHOUT security_invoker (see 0002_rls.sql), so it runs with the
-- view owner's privileges and bypasses the base-table RLS that otherwise
-- restricts products to rep+admin. Only the public-safe columns are listed.
create or replace view public.public_products as
  select
    id,
    slug,
    name,
    tagline,
    description,
    category,
    color,
    image_url,
    calories,
    is_gluten_free,
    featured
  from public.products;
