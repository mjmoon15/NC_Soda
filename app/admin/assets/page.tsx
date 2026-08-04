import type { Metadata } from "next";
import { ManageAssets } from "@/components/admin/ManageAssets";
import { getAssets } from "@/lib/data";

export const metadata: Metadata = { title: "Admin · Assets" };

export default async function AdminAssetsPage() {
  const assets = await getAssets();

  return (
    <div className="stack" style={{ gap: "1.25rem" }}>
      <header>
        <p className="eyebrow">Sales toolkit</p>
        <h1 style={{ fontSize: "1.7rem", marginBlock: "0.3rem 0.3rem" }}>
          Assets
        </h1>
        <p className="muted" style={{ fontSize: "0.95rem" }}>
          Sell sheets, POS artwork, spec sheets, and brand logos for reps.
        </p>
      </header>

      <ManageAssets assets={assets} />
    </div>
  );
}
