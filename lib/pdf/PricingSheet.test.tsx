import { describe, expect, it } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import type { Product } from "@/lib/types";
import { PricingLineSheet, PricingSkuSheet } from "./PricingSheet";

const product: Product = {
  id: "1",
  slug: "hopscotch-ginger-ale",
  name: "Hopscotch",
  tagline: "Ginger ale with a kick.",
  description: "",
  category: "Craft Soda",
  color: "#2E8B54",
  imageUrl: "",
  calories: 90,
  isGlutenFree: true,
  featured: false,
  sku: "",
  upc: "861011000348",
  caseUpc: "",
  casePack: 24,
  unitVolume: "12 fl oz",
  netWeight: "21 lb / case",
  ingredients: "",
  shelfLifeDays: 365,
  caseCost: 20.4,
};

/** Real PDF-rendering smoke tests — catches @react-pdf/renderer layout
 * errors (unsupported style props, bad StyleSheet values) that TypeScript
 * won't. */
describe("PricingSheet PDFs render without throwing", () => {
  it("renders the full-line sheet to a valid PDF buffer", async () => {
    const buffer = await renderToBuffer(
      <PricingLineSheet
        products={[product]}
        rep={{ name: "Riley Rep", email: "riley@example.com", company: "Coastal Beverage" }}
      />
    );
    expect(buffer.byteLength).toBeGreaterThan(500);
    expect(buffer.subarray(0, 5).toString("utf-8")).toBe("%PDF-");
  });

  it("renders the single-SKU sheet to a valid PDF buffer", async () => {
    const buffer = await renderToBuffer(
      <PricingSkuSheet product={product} rep={{ name: "Riley Rep" }} />
    );
    expect(buffer.byteLength).toBeGreaterThan(500);
    expect(buffer.subarray(0, 5).toString("utf-8")).toBe("%PDF-");
  });

  it("renders sensibly when case cost is not yet set", async () => {
    const buffer = await renderToBuffer(
      <PricingSkuSheet product={{ ...product, caseCost: null }} />
    );
    expect(buffer.byteLength).toBeGreaterThan(500);
  });
});
