import { describe, expect, it } from "vitest";
import {
  getAssets,
  getFeaturedProducts,
  getProduct,
  getProducts,
  getPublicVideos,
  getTrainingVideos,
} from "./index";
import * as mock from "./mock";

// No Supabase env in tests => demo path => returns seed data.

describe("data layer (demo mode)", () => {
  it("returns all seed products", async () => {
    const products = await getProducts();
    expect(products).toHaveLength(mock.products.length);
    expect(products[0]).toHaveProperty("sku");
  });

  it("returns only featured products", async () => {
    const featured = await getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it("looks up a product by slug", async () => {
    const p = await getProduct("parakey-key-lime-pie");
    expect(p?.name).toBe("Parakey");
  });

  it("returns null for an unknown slug", async () => {
    expect(await getProduct("does-not-exist")).toBeNull();
  });

  it("public videos exclude rep-gated training", async () => {
    const vids = await getPublicVideos();
    expect(vids.length).toBeGreaterThan(0);
    expect(vids.every((v) => v.access === "public")).toBe(true);
  });

  it("training videos are all rep-gated", async () => {
    const vids = await getTrainingVideos();
    expect(vids.length).toBeGreaterThan(0);
    expect(vids.every((v) => v.access === "rep")).toBe(true);
  });

  it("returns rep assets", async () => {
    const assets = await getAssets();
    expect(assets.length).toBeGreaterThan(0);
    expect(assets.every((a) => a.access === "rep")).toBe(true);
  });
});
