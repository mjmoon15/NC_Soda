import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Leaf, Lock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CanArt } from "@/components/product/CanArt";
import { getProduct, getProducts } from "@/lib/data";
import type { Product, ProductCategory } from "@/lib/types";
import styles from "./page.module.css";

type Tone = "brand" | "coral" | "citrus" | "neutral";
const CATEGORY_TONE: Record<ProductCategory, Tone> = {
  "Craft Soda": "brand",
  "Sparkling Hopwater": "citrus",
  "Margarita Mix": "coral",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`.trim(),
  };
}

/** Public-safe fact rows. SKU / UPC / case pack are rep-gated — never shown. */
function publicFacts(p: Product): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [
    { label: "Category", value: p.category },
  ];
  if (p.unitVolume) facts.push({ label: "Unit volume", value: p.unitVolume });
  facts.push({
    label: "Calories",
    value: p.calories === 0 ? "Zero" : `${p.calories} per can`,
  });
  facts.push({ label: "Gluten-free", value: p.isGlutenFree ? "Yes" : "No" });
  if (p.abv) facts.push({ label: "ABV", value: p.abv });
  return facts;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const facts = publicFacts(product);

  return (
    <section className="container section">
      <Link href="/products" className={styles.back}>
        <ArrowLeft size={15} /> All sodas
      </Link>

      <div className={styles.layout}>
        <div className={styles.artCol}>
          <CanArt product={product} className={styles.art} />
        </div>

        <div className={styles.info}>
          <div className={styles.headRow}>
            <Badge tone={CATEGORY_TONE[product.category]}>
              {product.category}
            </Badge>
            {product.isGlutenFree && (
              <span className={styles.gf}>
                <Leaf size={14} /> Gluten-free
              </span>
            )}
          </div>

          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.tagline}>{product.tagline}</p>
          <p className={styles.description}>{product.description}</p>

          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.label} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.gate}>
            <span className={styles.gateIcon}>
              <Lock size={16} />
            </span>
            <div>
              <p className={styles.gateTitle}>
                Sell sheets &amp; specs are in the partner portal
              </p>
              <p className="muted" style={{ fontSize: "0.88rem" }}>
                SKU, UPC, case pack, and downloadable assets are available to
                signed-in partners.
              </p>
            </div>
            <Button href="/login" variant="outline" size="sm">
              Partner sign in
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
