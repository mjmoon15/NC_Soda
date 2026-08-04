import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { ProductCatalog } from "./ProductCatalog";

export const metadata: Metadata = {
  title: "Sodas",
  description:
    "Browse the full New Creation lineup — craft sodas, sparkling hopwater, and margarita mixes made with real ingredients.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <section className="dot-grid">
        <div className="container section" style={{ paddingBottom: 0 }}>
          <p className="eyebrow">The lineup</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0.5rem 0 0.75rem" }}>
            Every flavor we make
          </h1>
          <p className="lead" style={{ maxWidth: "44ch" }}>
            Cane-sugar craft sodas, zero-proof hopwater, and bar-quality
            margarita mixes. No neon, no junk — just real ingredients.
          </p>
        </div>
      </section>

      <section className="container section">
        <ProductCatalog products={products} />
      </section>
    </>
  );
}
