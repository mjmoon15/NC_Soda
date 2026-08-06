import type { Metadata } from "next";
import { Download } from "lucide-react";
import { PricingTable } from "@/components/rep/PricingTable";
import { SendPricingModal } from "@/components/rep/SendPricingModal";
import { getRepProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Pricing · Rep Portal" };

export default async function RepPricingPage() {
  const products = await getRepProducts();

  return (
    <div className="stack" style={{ gap: 20 }}>
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Buyer-Ready</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Pricing</h1>
        <p className="lead" style={{ maxWidth: "60ch" }}>
          Wholesale cost per case, unit, and ounce for every SKU — hand it to
          a buyer as a PDF, or email it straight from here.
        </p>
      </header>

      <div className={"row"} style={{ gap: 10, flexWrap: "wrap" }}>
        <a
          href="/api/rep/pricing-sheet"
          className="btn btn-outline btn-sm"
          download
        >
          <Download size={15} />
          Download full price list (PDF)
        </a>
        <SendPricingModal title="the full price list" compact />
      </div>

      <PricingTable products={products} />

      <p className="muted" style={{ fontSize: "0.82rem", maxWidth: "60ch" }}>
        Costs shown are wholesale case price to distributor and are subject
        to change. Cost/oz is derived from case cost, case pack, and unit
        volume — useful for comparing value across different pack sizes.
      </p>
    </div>
  );
}
