import type { Metadata } from "next";
import { ManageProducts } from "@/components/admin/ManageProducts";
import { getRepProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Admin · Products" };

export default async function AdminProductsPage() {
  const products = await getRepProducts();

  return (
    <div className="stack" style={{ gap: "1.25rem" }}>
      <header>
        <p className="eyebrow">Catalog</p>
        <h1 style={{ fontSize: "1.7rem", marginBlock: "0.3rem 0.3rem" }}>
          Products
        </h1>
        <p className="muted" style={{ fontSize: "0.95rem" }}>
          Every SKU across craft soda, hopwater, and margarita mixers.
        </p>
      </header>

      <ManageProducts products={products} />
    </div>
  );
}
