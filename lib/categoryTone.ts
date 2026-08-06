import type { ProductCategory } from "@/lib/types";

export type Tone = "brand" | "coral" | "citrus" | "neutral";

/**
 * Badge tone per product category — shared across the admin product table,
 * the (currently unused) public product card, and the rep product detail
 * page, so a new category only needs a tone assigned in one place.
 */
export const CATEGORY_TONE: Record<ProductCategory, Tone> = {
  "Craft Soda": "brand",
  "Sparkling Hopwater": "citrus",
  "Margarita Mix": "coral",
  "Sparkling Botanicals": "neutral",
};
