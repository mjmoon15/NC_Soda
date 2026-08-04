/**
 * Domain types shared across all three surfaces (public / rep / admin)
 * and both data paths (demo mock + Supabase). DB columns are snake_case;
 * see lib/data/index.ts for the row -> type mappers.
 */

export type UserRole = "public" | "rep" | "admin";

export type ProductCategory =
  | "Craft Soda"
  | "Sparkling Hopwater"
  | "Margarita Mix";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  /** hex accent used to theme the product card */
  color: string;
  imageUrl: string;
  calories: number;
  isGlutenFree: boolean;
  featured: boolean;

  /* ── gated rep-only data ── */
  sku: string;
  upc: string;
  caseUpc: string;
  casePack: number; // units per case
  unitVolume: string; // e.g. "12 fl oz"
  netWeight: string; // e.g. "9.0 lb / case"
  abv?: string; // hopwater = N/A, present where relevant
  ingredients: string;
  shelfLifeDays: number;
}

export type VideoAccess = "public" | "rep";
export type VideoCategory = "brand" | "product" | "training";

export interface Video {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  access: VideoAccess;
  /** public videos play from YouTube */
  youtubeId?: string;
  /** gated videos stream from Mux via a signed playback token */
  muxPlaybackId?: string;
  /** Mux asset processing state, e.g. "ready" | "preparing" | "errored" */
  muxStatus?: string;
  /** legacy: gated videos previously streamed from Supabase Storage */
  storagePath?: string;
  thumbnailUrl: string;
  durationSeconds: number;
}

export type AssetType = "sell_sheet" | "pos" | "spec_sheet" | "logo";

export interface Asset {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  /** demo: a public placeholder URL; real: Supabase Storage signed URL */
  fileUrl: string;
  fileType: string; // "PDF", "PNG", "ZIP"
  sizeBytes: number;
  productSlug?: string;
  access: "rep";
}

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  company?: string;
}

/** The authenticated viewer (or a demo persona). */
export interface SessionUser {
  email: string;
  fullName: string;
  role: UserRole;
  company?: string;
  /** true when this is a cookie-based demo persona, not a real Supabase user */
  isDemo: boolean;
}
