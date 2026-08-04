/**
 * Central runtime config + demo-mode detection.
 *
 * The whole app is designed to run with NO Supabase project attached:
 * when the env vars below are missing we fall back to seed/mock data and a
 * cookie-based "demo" auth so the UI is fully explorable via `npm run dev`.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True only when a real Supabase project is wired up. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Inverse helper for readability at call sites. */
export const isDemoMode = !isSupabaseConfigured;

export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";

/**
 * True when a Sanity project is wired up. Independent of Supabase: content
 * (editorial copy, images) lives in Sanity, gated spec data (SKU/UPC/etc)
 * lives in Supabase. Either can be configured without the other — the data
 * layer falls back to seed data per-source when one is missing.
 */
export const isSanityConfigured = Boolean(SANITY_PROJECT_ID && SANITY_DATASET);

export const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID ?? "";
export const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET ?? "";
export const MUX_SIGNING_KEY_ID = process.env.MUX_SIGNING_KEY_ID ?? "";
export const MUX_SIGNING_KEY_PRIVATE = process.env.MUX_SIGNING_KEY_PRIVATE ?? "";

/**
 * True when Mux credentials for minting signed playback tokens are present.
 * Training videos fall back to a "not yet connected" placeholder when false.
 */
export const isMuxConfigured = Boolean(
  MUX_TOKEN_ID && MUX_TOKEN_SECRET && MUX_SIGNING_KEY_ID && MUX_SIGNING_KEY_PRIVATE
);

export const SITE = {
  name: "New Creation Soda Works",
  shortName: "New Creation",
  tagline: "Real ingredients. Joyful fizz.",
} as const;
