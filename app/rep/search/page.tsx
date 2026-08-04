import type { Metadata } from "next";
import { RepSearch, type SearchItem } from "@/components/rep/RepSearch";
import { getAssets, getRepProducts, getTrainingVideos } from "@/lib/data";

export const metadata: Metadata = { title: "Search · Rep Portal" };

export default async function RepSearchPage() {
  const [products, assets, videos] = await Promise.all([
    getRepProducts(),
    getAssets(),
    getTrainingVideos(),
  ]);

  const items: SearchItem[] = [
    ...products.map((p) => ({
      id: p.id,
      kind: "product" as const,
      title: p.name,
      subtitle: p.category,
      detail: p.tagline,
      href: "/rep/products",
      keywords: [p.name, p.sku, p.upc, p.caseUpc, p.category, p.tagline],
    })),
    ...assets.map((a) => ({
      id: a.id,
      kind: "asset" as const,
      title: a.title,
      subtitle: a.fileType,
      detail: a.description,
      href: "/rep/sell-sheets",
      keywords: [a.title, a.description, a.fileType, a.type],
    })),
    ...videos.map((v) => ({
      id: v.id,
      kind: "training" as const,
      title: v.title,
      subtitle: "Training",
      detail: v.description,
      href: "/rep/training",
      keywords: [v.title, v.description, "training"],
    })),
  ];

  return (
    <div className="stack" style={{ gap: 20 }}>
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">One Box</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Search</h1>
        <p className="lead" style={{ maxWidth: "56ch" }}>
          Search across products, sell sheets &amp; POS, and training — all in
          one place.
        </p>
      </header>

      <RepSearch items={items} />
    </div>
  );
}
