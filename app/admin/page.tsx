import type { Metadata } from "next";
import Link from "next/link";
import {
  Boxes,
  Clapperboard,
  Database,
  FileText,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { isDemoMode } from "@/lib/config";
import { getAllVideos, getAssets, getRepProducts } from "@/lib/data";

export const metadata: Metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const [products, videos, assets] = await Promise.all([
    getRepProducts(),
    getAllVideos(),
    getAssets(),
  ]);

  const featuredCount = products.filter((p) => p.featured).length;
  const gatedVideoCount = videos.filter((v) => v.access === "rep").length;

  const cards = [
    {
      href: "/admin/products",
      icon: Boxes,
      label: "Products",
      count: products.length,
      detail: `${featuredCount} featured`,
    },
    {
      href: "/admin/videos",
      icon: Clapperboard,
      label: "Videos",
      count: videos.length,
      detail: `${gatedVideoCount} rep-gated`,
    },
    {
      href: "/admin/assets",
      icon: FileText,
      label: "Assets",
      count: assets.length,
      detail: "sell sheets, POS & logos",
    },
  ];

  return (
    <div className="stack" style={{ gap: "1.75rem" }}>
      <header>
        <p className="eyebrow">Content Admin</p>
        <h1 style={{ fontSize: "1.9rem", marginBlock: "0.35rem 0.4rem" }}>
          Overview
        </h1>
        <p className="lead">
          Manage the catalog, training videos, and sales assets that power the
          public site and the rep portal.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gap: "1.25rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.href} href={c.href} style={{ display: "block" }}>
              <Card>
                <div
                  className="row"
                  style={{ justifyContent: "space-between", marginBottom: 14 }}
                >
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "var(--brand-50)",
                      color: "var(--brand-600)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  {c.label === "Products" && featuredCount > 0 ? (
                    <Badge tone="citrus">
                      <Star size={12} /> {featuredCount}
                    </Badge>
                  ) : null}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    lineHeight: 1,
                  }}
                >
                  {c.count}
                </div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>{c.label}</div>
                <div className="muted" style={{ fontSize: "0.82rem" }}>
                  {c.detail}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {isDemoMode ? (
        <Card>
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <Database size={18} style={{ color: "var(--brand-600)" }} />
            <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
              You&apos;re editing in demo mode
            </strong>
          </div>
          <p className="muted" style={{ fontSize: "0.92rem", maxWidth: "62ch" }}>
            No Supabase project is connected, so this admin runs on seed data.
            Create, edit, and upload actions are <strong>illustrative</strong> —
            forms validate and confirm, but nothing is written anywhere. Connect
            a Supabase project (see <code>SETUP_CHECKLIST.md</code>) to persist
            changes and enable real role-based access control.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
