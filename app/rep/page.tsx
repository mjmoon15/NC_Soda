import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Boxes,
  FileText,
  GraduationCap,
  Search,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getAssets, getRepProducts, getTrainingVideos } from "@/lib/data";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Rep Dashboard" };

export default async function RepDashboardPage() {
  const [user, products, assets, training] = await Promise.all([
    getSessionUser(),
    getRepProducts(),
    getAssets(),
    getTrainingVideos(),
  ]);

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const stats = [
    {
      label: "Products",
      value: products.length,
      hint: "Full SKU & case data",
      href: "/rep/products",
      icon: Boxes,
      tone: "brand" as const,
    },
    {
      label: "Sell Sheets & POS",
      value: assets.length,
      hint: "Downloadable assets",
      href: "/rep/sell-sheets",
      icon: FileText,
      tone: "coral" as const,
    },
    {
      label: "Training Videos",
      value: training.length,
      hint: "Rep-only walkthroughs",
      href: "/rep/training",
      icon: GraduationCap,
      tone: "citrus" as const,
    },
  ];

  const links = [
    {
      href: "/rep/products",
      title: "Look up product data",
      desc: "Search SKUs, UPCs, case packs, and specs in one gated table.",
      icon: Boxes,
    },
    {
      href: "/rep/sell-sheets",
      title: "Grab a sell sheet",
      desc: "Sell sheets, spec sheets, POS art, and logos for any account.",
      icon: FileText,
    },
    {
      href: "/rep/training",
      title: "Watch training",
      desc: "Cooler sets, buyer pitches, and margin math — rep-only.",
      icon: GraduationCap,
    },
    {
      href: "/rep/search",
      title: "Search everything",
      desc: "One search box across products, assets, and training.",
      icon: Search,
    },
  ];

  return (
    <div className={`stack ${styles.page}`}>
      <header className={`dot-grid ${styles.hero} animate-fade-up`}>
        <span className="eyebrow">Rep Portal</span>
        <h1 className={styles.greeting}>Welcome back, {firstName}.</h1>
        <p className="lead" style={{ maxWidth: "52ch" }}>
          Everything you need to sell New Creation — gated SKU data, sell
          sheets, POS art, and training, all in one place.
        </p>
      </header>

      <section className={styles.statGrid}>
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className={`card card-pad ${styles.stat}`}
            >
              <span className={`badge badge-${s.tone} ${styles.statIcon}`}>
                <Icon size={16} />
              </span>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
              <span className="muted" style={{ fontSize: "0.82rem" }}>
                {s.hint}
              </span>
            </Link>
          );
        })}
      </section>

      <section className="stack" style={{ gap: 14 }}>
        <h2 className={styles.sectionTitle}>Quick links</h2>
        <div className={styles.linkGrid}>
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`card card-pad ${styles.linkCard}`}
              >
                <span className={styles.linkIcon}>
                  <Icon size={18} />
                </span>
                <div className="stack" style={{ gap: 2 }}>
                  <strong className={styles.linkTitle}>
                    {l.title}
                    <ArrowRight size={15} className={styles.linkArrow} />
                  </strong>
                  <span className="muted" style={{ fontSize: "0.88rem" }}>
                    {l.desc}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
