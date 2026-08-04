import Link from "next/link";
import { ArrowRight, Citrus, CupSoda, Sparkles, Wine } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CanArt } from "@/components/product/CanArt";
import { ProductCard } from "@/components/product/ProductCard";
import { LiteYouTube } from "@/components/video/LiteYouTube";
import { getFeaturedProducts, getProducts, getPublicVideos } from "@/lib/data";
import styles from "./page.module.css";

const WAYS = [
  {
    icon: CupSoda,
    title: "Craft Soda",
    body: "Cane-sugar classics — root beer, key lime cream, cherry cola — made nostalgic but never cloying.",
    href: "/products",
    badge: "brand" as const,
    accent: "var(--brand-100)",
    color: "var(--brand-700)",
  },
  {
    icon: Citrus,
    title: "Sparkling Hopwater",
    body: "Dry-hopped sparkling water with real hop aromatics. Zero sugar, zero proof, all flavor.",
    href: "/products",
    badge: "citrus" as const,
    accent: "var(--citrus-100)",
    color: "var(--citrus-600)",
  },
  {
    icon: Wine,
    title: "Margarita Mix",
    body: "Bar-quality mixes with real lime and agave. Just add tequila — we won't tell.",
    href: "/products",
    badge: "coral" as const,
    accent: "var(--coral-300)",
    color: "var(--coral-600)",
  },
];

export default async function HomePage() {
  const [featured, all, videos] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
    getPublicVideos(),
  ]);

  const heroCans = (featured.length >= 3 ? featured : all).slice(0, 3);
  const teaser = videos.find((v) => v.youtubeId);

  return (
    <>
      {/* ── HERO ────────────────────────────────────────── */}
      <section className={`dot-grid ${styles.hero}`}>
        <div className="container section">
          <div className={styles.heroGrid}>
            <div className="animate-fade-up">
              <p className="eyebrow">{`Real ingredients · Joyful fizz`}</p>
              <h1 className={styles.heroTitle}>
                Soda made <em>the hard way</em>, the way it should taste.
              </h1>
              <p className={styles.heroSub}>
                Cane-sugar craft sodas, zero-proof sparkling hopwater, and
                bar-quality margarita mixes — small-batch, gluten-free, and
                stubbornly real.
              </p>
              <div className={styles.heroCtas}>
                <Button href="/products" size="lg" variant="coral">
                  Explore the sodas
                </Button>
                <Button href="/login" size="lg" variant="outline">
                  Partner sign in
                </Button>
              </div>
            </div>

            <div className={styles.heroArt} aria-hidden>
              {heroCans.map((p) => (
                <CanArt key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED STRIP ──────────────────────────────── */}
      <section className="container section">
        <div className={styles.headRow}>
          <div>
            <p className="eyebrow">Crowd favorites</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)" }}>
              The ones people come back for
            </h2>
          </div>
          <Link href="/products" className={styles.wayLink}>
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className={styles.featuredGrid}>
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── THREE WAYS TO ENJOY ─────────────────────────── */}
      <section className="dot-grid">
        <div className="container section">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Three ways to enjoy</p>
            <h2>One obsession, three pours</h2>
          </div>

          <div className={styles.ways}>
            {WAYS.map((way) => {
              const Icon = way.icon;
              return (
                <article key={way.title} className={styles.way}>
                  <span
                    className={styles.wayIcon}
                    style={{ background: way.accent, color: way.color }}
                  >
                    <Icon size={24} />
                  </span>
                  <Badge tone={way.badge}>{way.title}</Badge>
                  <h3 className={styles.wayTitle}>{way.title}</h3>
                  <p className={styles.wayBody}>{way.body}</p>
                  <Link href={way.href} className={styles.wayLink}>
                    Shop the line <ArrowRight size={15} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── VIDEO TEASER ────────────────────────────────── */}
      {teaser && (
        <section className="container section">
          <div className={styles.teaser}>
            <div>
              <p className="eyebrow">Watch</p>
              <h2 style={{ fontSize: "clamp(1.8rem, 4.5vw, 2.6rem)", margin: "0.5rem 0 0.75rem" }}>
                {teaser.title}
              </h2>
              <p className="lead" style={{ marginBottom: "1.5rem" }}>
                {teaser.description}
              </p>
              <Button href="/videos" variant="outline">
                More videos <ArrowRight size={16} />
              </Button>
            </div>
            <LiteYouTube
              youtubeId={teaser.youtubeId as string}
              title={teaser.title}
            />
          </div>
        </section>
      )}

      {/* ── CLOSING CTA BAND ────────────────────────────── */}
      <section className="container" style={{ paddingBottom: 88 }}>
        <div className={`dot-grid ${styles.band}`}>
          <span
            style={{
              display: "inline-grid",
              placeItems: "center",
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              color: "#fff",
              margin: "0 auto 1rem",
            }}
          >
            <Sparkles size={22} />
          </span>
          <h2 className={styles.bandTitle}>Pour something real</h2>
          <p className={styles.bandSub}>
            Find your flavor, or sign in as a partner for sell sheets, specs,
            training, and POS assets.
          </p>
          <div className={styles.bandCtas}>
            <Button href="/products" size="lg" variant="coral">
              Explore the sodas
            </Button>
            <Button href="/login" size="lg" variant="ghost">
              Partner sign in
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
