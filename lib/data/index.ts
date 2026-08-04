/**
 * Data access layer. Every read goes through here so surfaces never branch on
 * demo-vs-real themselves.
 *
 * Two independent sources, merged by slug:
 *  - Sanity holds public/editorial content (name, tagline, description,
 *    images, category, featured, video + asset metadata). Public dataset —
 *    nothing gated lives there.
 *  - Supabase holds gated spec data behind RLS (SKU, UPC, case pack, net
 *    weight, ABV, ingredients, shelf life) and (soon) signed URLs for gated
 *    files.
 *
 * When Sanity isn't configured, everything falls back to the pre-Sanity
 * behavior (Supabase-only or seed mock data) so the app still works.
 */
import { isSanityConfigured, isSupabaseConfigured } from "@/lib/config";
import type { Asset, Product, Video } from "@/lib/types";
import * as mock from "./mock";

/* ── row mappers (snake_case DB row -> camelCase domain type) ───────── */

type Row = Record<string, unknown>;

function mapProduct(r: Row): Product {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    tagline: String(r.tagline ?? ""),
    description: String(r.description ?? ""),
    category: r.category as Product["category"],
    color: String(r.color ?? "#2E8B54"),
    imageUrl: String(r.image_url ?? ""),
    calories: Number(r.calories ?? 0),
    isGlutenFree: Boolean(r.is_gluten_free),
    featured: Boolean(r.featured),
    sku: String(r.sku ?? ""),
    upc: String(r.upc ?? ""),
    caseUpc: String(r.case_upc ?? ""),
    casePack: Number(r.case_pack ?? 0),
    unitVolume: String(r.unit_volume ?? ""),
    netWeight: String(r.net_weight ?? ""),
    abv: r.abv ? String(r.abv) : undefined,
    ingredients: String(r.ingredients ?? ""),
    shelfLifeDays: Number(r.shelf_life_days ?? 0),
  };
}

function mapVideo(r: Row): Video {
  return {
    id: String(r.id),
    title: String(r.title),
    description: String(r.description ?? ""),
    category: r.category as Video["category"],
    access: r.access as Video["access"],
    youtubeId: r.youtube_id ? String(r.youtube_id) : undefined,
    storagePath: r.storage_path ? String(r.storage_path) : undefined,
    thumbnailUrl: String(r.thumbnail_url ?? ""),
    durationSeconds: Number(r.duration_seconds ?? 0),
  };
}

function mapAsset(r: Row): Asset {
  return {
    id: String(r.id),
    title: String(r.title),
    description: String(r.description ?? ""),
    type: r.type as Asset["type"],
    fileUrl: String(r.file_url ?? "#"),
    fileType: String(r.file_type ?? ""),
    sizeBytes: Number(r.size_bytes ?? 0),
    productSlug: r.product_slug ? String(r.product_slug) : undefined,
    access: "rep",
  };
}

/* ── Sanity content reads ────────────────────────────────────────────
 * Gated fields are left at safe empty defaults here; getRepProducts()
 * fills them in from Supabase after the rep/admin check passes.
 */

const GATED_PRODUCT_DEFAULTS = {
  sku: "",
  upc: "",
  caseUpc: "",
  casePack: 0,
  unitVolume: "",
  netWeight: "",
  abv: undefined as string | undefined,
  ingredients: "",
  shelfLifeDays: 0,
};

type GatedProductFields = typeof GATED_PRODUCT_DEFAULTS;

async function fetchSanityProducts(): Promise<Product[]> {
  const { client } = await import("@/sanity/lib/client");
  const { PRODUCTS_QUERY } = await import("@/sanity/lib/queries");
  const docs = await client.fetch<Row[]>(PRODUCTS_QUERY);
  return docs.map((d) => ({
    id: String(d.id),
    slug: String(d.slug),
    name: String(d.name),
    tagline: String(d.tagline ?? ""),
    description: String(d.description ?? ""),
    category: d.category as Product["category"],
    color: String(d.color ?? "#2E8B54"),
    imageUrl: String(d.imageUrl ?? ""),
    calories: Number(d.calories ?? 0),
    isGlutenFree: Boolean(d.isGlutenFree),
    featured: Boolean(d.featured),
    ...GATED_PRODUCT_DEFAULTS,
  }));
}

/** Gated spec fields keyed by slug, from Supabase (or mock as a fallback). */
async function fetchGatedProductSpecs(): Promise<Map<string, GatedProductFields>> {
  const map = new Map<string, GatedProductFields>();
  const pluck = (p: Product): GatedProductFields => ({
    sku: p.sku,
    upc: p.upc,
    caseUpc: p.caseUpc,
    casePack: p.casePack,
    unitVolume: p.unitVolume,
    netWeight: p.netWeight,
    abv: p.abv,
    ingredients: p.ingredients,
    shelfLifeDays: p.shelfLifeDays,
  });

  if (isSupabaseConfigured) {
    const { createServerSupabase } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabase();
    const { data } = await supabase.from("products").select("*");
    (data ?? []).forEach((r) => map.set(String(r.slug), pluck(mapProduct(r))));
  } else {
    mock.products.forEach((p) => map.set(p.slug, pluck(p)));
  }
  return map;
}

async function fetchSanityVideos(): Promise<Video[]> {
  const { client } = await import("@/sanity/lib/client");
  const { VIDEOS_QUERY } = await import("@/sanity/lib/queries");
  const docs = await client.fetch<Row[]>(VIDEOS_QUERY);
  return docs.map((d) => ({
    id: String(d.id),
    title: String(d.title),
    description: String(d.description ?? ""),
    category: d.category as Video["category"],
    access: d.access as Video["access"],
    youtubeId: d.youtubeId ? String(d.youtubeId) : undefined,
    muxPlaybackId: d.muxPlaybackId ? String(d.muxPlaybackId) : undefined,
    muxStatus: d.muxStatus ? String(d.muxStatus) : undefined,
    thumbnailUrl: String(d.thumbnailUrl ?? ""),
    durationSeconds: Number(d.durationSeconds ?? 0),
  }));
}

/**
 * Mints a short-lived signed URL for a gated file in the private "assets"
 * Supabase Storage bucket. Falls back to the demo placeholder when Supabase
 * isn't configured or the object has no storage path yet. Callers (the rep
 * sell-sheets/search pages) are already behind app/rep/layout.tsx's
 * hasAccess(user, "rep") check.
 */
async function signAssetUrl(storagePath?: string): Promise<string> {
  if (!storagePath || !isSupabaseConfigured) return "#demo-asset";
  const { createServiceSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServiceSupabase();
  const { data, error } = await supabase.storage
    .from("assets")
    .createSignedUrl(storagePath, 60 * 60); // 1 hour
  if (error || !data?.signedUrl) {
    console.error(`[signAssetUrl] failed for "${storagePath}":`, error);
    return "#demo-asset";
  }
  return data.signedUrl;
}

async function fetchSanityAssets(): Promise<Asset[]> {
  const { client } = await import("@/sanity/lib/client");
  const { ASSETS_QUERY } = await import("@/sanity/lib/queries");
  const docs = await client.fetch<Row[]>(ASSETS_QUERY);
  return Promise.all(
    docs.map(async (d) => ({
      id: String(d.id),
      title: String(d.title),
      description: String(d.description ?? ""),
      type: d.type as Asset["type"],
      fileUrl: await signAssetUrl(
        d.storagePath ? String(d.storagePath) : undefined
      ),
      fileType: String(d.fileType ?? ""),
      sizeBytes: Number(d.sizeBytes ?? 0),
      productSlug: d.productSlug ? String(d.productSlug) : undefined,
      access: "rep" as const,
    }))
  );
}

/* ── products ──────────────────────────────────────────────────────── */

/**
 * PUBLIC catalog read. Sourced from Sanity when configured (gated fields
 * come back empty — public callers never need them). Falls back to the
 * Supabase public_products view, then seed data, when Sanity isn't set up.
 */
export async function getProducts(): Promise<Product[]> {
  if (isSanityConfigured) return fetchSanityProducts();
  if (!isSupabaseConfigured) return mock.products;
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("public_products")
    .select("*")
    .order("name");
  return (data ?? []).map(mapProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.featured);
}

/** PUBLIC single-product read (gated fields empty unless via getRepProducts). */
export async function getProduct(slug: string): Promise<Product | null> {
  if (isSanityConfigured) {
    return (await fetchSanityProducts()).find((p) => p.slug === slug) ?? null;
  }
  if (!isSupabaseConfigured) {
    return mock.products.find((p) => p.slug === slug) ?? null;
  }
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("public_products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapProduct(data) : null;
}

/**
 * REP-GATED read: content from Sanity merged with gated spec fields from
 * Supabase (RLS-restricted to rep+admin there), joined by slug.
 */
export async function getRepProducts(): Promise<Product[]> {
  if (isSanityConfigured) {
    const [content, specs] = await Promise.all([
      fetchSanityProducts(),
      fetchGatedProductSpecs(),
    ]);
    return content.map((p) => ({
      ...p,
      ...(specs.get(p.slug) ?? GATED_PRODUCT_DEFAULTS),
    }));
  }
  if (!isSupabaseConfigured) return mock.products;
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("products").select("*").order("name");
  return (data ?? []).map(mapProduct);
}

/* ── videos ────────────────────────────────────────────────────────── */

/** Public videos only — safe for the unauthenticated video hub. */
export async function getPublicVideos(): Promise<Video[]> {
  if (isSanityConfigured) {
    return (await fetchSanityVideos()).filter((v) => v.access === "public");
  }
  if (!isSupabaseConfigured) {
    return mock.videos.filter((v) => v.access === "public");
  }
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("access", "public");
  return (data ?? []).map(mapVideo);
}

/** Rep-gated training videos. RLS blocks these for non-reps in real mode. */
export async function getTrainingVideos(): Promise<Video[]> {
  if (isSanityConfigured) {
    return (await fetchSanityVideos()).filter((v) => v.access === "rep");
  }
  if (!isSupabaseConfigured) {
    return mock.videos.filter((v) => v.access === "rep");
  }
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("videos").select("*").eq("access", "rep");
  return (data ?? []).map(mapVideo);
}

export async function getAllVideos(): Promise<Video[]> {
  if (isSanityConfigured) return fetchSanityVideos();
  if (!isSupabaseConfigured) return mock.videos;
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("videos").select("*");
  return (data ?? []).map(mapVideo);
}

/* ── assets (sell sheets / POS) ────────────────────────────────────── */

export async function getAssets(): Promise<Asset[]> {
  if (isSanityConfigured) return fetchSanityAssets();
  if (!isSupabaseConfigured) return mock.assets;
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("assets").select("*").order("title");
  return (data ?? []).map(mapAsset);
}
