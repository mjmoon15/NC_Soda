/**
 * Wholesale cost math shared by the internal spec table, the buyer-facing
 * pricing page, and the generated pricing-sheet PDF. All costs originate
 * from `Product.caseCost` (USD per case) in Supabase; everything else here
 * is derived, not stored, so it can never drift out of sync.
 */
import type { Product } from "@/lib/types";

export interface CostMetrics {
  /** USD per case, straight from the source field. */
  costPerCase: number | null;
  /** USD per single unit (can/bottle). */
  costPerUnit: number | null;
  /** USD per fluid ounce — the number buyers use to compare across pack sizes. */
  costPerOz: number | null;
}

/**
 * Parses a unit-volume string like "12 fl oz" or "1/2 gal" into fluid
 * ounces. Returns null for anything it doesn't recognize rather than
 * guessing.
 */
export function parseUnitVolumeToOz(unitVolume: string): number | null {
  const s = unitVolume.trim().toLowerCase();

  let m = s.match(/^([\d.]+)\s*fl\s*oz$/);
  if (m) return parseFloat(m[1]);

  // fraction gallons, e.g. "1/2 gal"
  m = s.match(/^(\d+)\s*\/\s*(\d+)\s*gal(?:lon)?s?$/);
  if (m) return (parseInt(m[1], 10) / parseInt(m[2], 10)) * 128;

  // plain gallons, e.g. "1 gal" or "0.5 gal"
  m = s.match(/^([\d.]+)\s*gal(?:lon)?s?$/);
  if (m) return parseFloat(m[1]) * 128;

  return null;
}

/** Derives cost/unit and cost/oz for a product from its case cost. */
export function computeCostMetrics(
  product: Pick<Product, "caseCost" | "casePack" | "unitVolume">
): CostMetrics {
  const { caseCost, casePack, unitVolume } = product;
  if (caseCost == null || !casePack) {
    return { costPerCase: caseCost, costPerUnit: null, costPerOz: null };
  }
  const costPerUnit = caseCost / casePack;
  const oz = parseUnitVolumeToOz(unitVolume);
  const costPerOz = oz ? costPerUnit / oz : null;
  return { costPerCase: caseCost, costPerUnit, costPerOz };
}

/** Formats a cost as USD, e.g. $20.40 or $0.0708. Extra precision for
 * sub-dollar figures like cost/oz, which round to $0.00 at 2 decimals. */
export function formatCost(value: number | null, decimals = 2): string {
  if (value == null) return "—";
  return `$${value.toFixed(decimals)}`;
}
