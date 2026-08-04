import type { Metadata } from "next";
import { FileText, Image as ImageIcon, Package, Shapes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AssetCard } from "@/components/rep/AssetCard";
import { getAssets } from "@/lib/data";
import type { Asset, AssetType } from "@/lib/types";
import styles from "./sell-sheets.module.css";

export const metadata: Metadata = { title: "Sell Sheets & POS · Rep Portal" };

const GROUPS: {
  type: AssetType;
  title: string;
  blurb: string;
  icon: LucideIcon;
}[] = [
  {
    type: "sell_sheet",
    title: "Sell Sheets",
    blurb: "One-pagers with flavor profiles, specs, and shelf talkers.",
    icon: FileText,
  },
  {
    type: "spec_sheet",
    title: "Spec Sheets",
    blurb: "Full-line catalogs and detailed specification documents.",
    icon: Shapes,
  },
  {
    type: "pos",
    title: "Point of Sale",
    blurb: "Print-ready cooler clings, shelf talkers, and display art.",
    icon: Package,
  },
  {
    type: "logo",
    title: "Logos & Brand",
    blurb: "Logo packs and brand marks in vector + raster formats.",
    icon: ImageIcon,
  },
];

export default async function SellSheetsPage() {
  const assets = await getAssets();
  const byType = (t: AssetType): Asset[] =>
    assets.filter((a) => a.type === t);

  return (
    <div className="stack" style={{ gap: 36 }}>
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Marketing Assets</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Sell Sheets &amp; POS
        </h1>
        <p className="lead" style={{ maxWidth: "56ch" }}>
          Everything you need to pitch and merchandise an account — sell
          sheets, spec docs, point-of-sale art, and brand logos.
        </p>
      </header>

      {GROUPS.map((g) => {
        const items = byType(g.type);
        if (items.length === 0) return null;
        const Icon = g.icon;
        return (
          <section key={g.type} className="stack" style={{ gap: 16 }}>
            <div className={styles.groupHead}>
              <span className={styles.groupIcon}>
                <Icon size={18} />
              </span>
              <div className="stack" style={{ gap: 1 }}>
                <h2 className={styles.groupTitle}>{g.title}</h2>
                <span className="muted" style={{ fontSize: "0.88rem" }}>
                  {g.blurb}
                </span>
              </div>
            </div>
            <div className={styles.grid}>
              {items.map((a) => (
                <AssetCard key={a.id} asset={a} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
