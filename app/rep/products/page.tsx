import type { Metadata } from "next";
import { ProductTable } from "@/components/rep/ProductTable";
import { getRepProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Product Data · Rep Portal" };

export default async function RepProductsPage() {
  const products = await getRepProducts();

  return (
    <div className="stack" style={{ gap: 20 }}>
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Gated Data</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Product Data</h1>
        <p className="lead" style={{ maxWidth: "56ch" }}>
          Every SKU, UPC, case pack, and spec — the numbers buyers ask for.
          Search by name, SKU, or UPC and filter by category.
        </p>
      </header>

      <ProductTable products={products} />
    </div>
  );
}
