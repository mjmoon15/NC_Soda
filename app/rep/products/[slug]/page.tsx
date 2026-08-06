import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Leaf, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CanArt } from "@/components/product/CanArt";
import { AssetCard } from "@/components/rep/AssetCard";
import { SendPricingModal } from "@/components/rep/SendPricingModal";
import { getAssets, getRepProducts } from "@/lib/data";
import { computeCostMetrics, formatCost } from "@/lib/pricing";
import { CATEGORY_TONE } from "@/lib/categoryTone";
import styles from "./product-detail.module.css";

async function findProduct(slug: string) {
  const products = await getRepProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  return { title: product ? `${product.name} · Rep Portal` : "Product · Rep Portal" };
}

export default async function RepProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, assets] = await Promise.all([findProduct(slug), getAssets()]);

  if (!product) notFound();

  const cost = computeCostMetrics(product);
  const linkedAssets = assets.filter((a) => a.productSlug === product.slug);

  return (
    <div className="stack" style={{ gap: 28 }}>
      <Link href="/rep/products" className={styles.back}>
        <ArrowLeft size={15} />
        Back to Product Data
      </Link>

      <div className={styles.hero}>
        <div className={styles.heroArt}>
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className={styles.image}
            />
          ) : (
            <CanArt product={product} />
          )}
        </div>

        <div className="stack" style={{ gap: 10 }}>
          <Badge tone={CATEGORY_TONE[product.category]}>{product.category}</Badge>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)" }}>{product.name}</h1>
          {product.tagline ? <p className="lead">{product.tagline}</p> : null}
          {product.description ? (
            <p className="muted" style={{ maxWidth: "62ch" }}>
              {product.description}
            </p>
          ) : null}
          <div className={styles.flags}>
            {product.isGlutenFree ? (
              <Badge tone="citrus">
                <Leaf size={12} /> Gluten-free
              </Badge>
            ) : null}
            {product.featured ? (
              <Badge tone="brand">
                <Star size={12} /> Featured
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      <section className="card card-pad">
        <h2 className={styles.sectionTitle}>Specs</h2>
        <div className={styles.specGrid}>
          <SpecItem label="SKU" value={product.sku || "—"} />
          <SpecItem label="UPC" value={product.upc || "—"} />
          <SpecItem label="Case UPC" value={product.caseUpc || "—"} />
          <SpecItem
            label="Case Pack"
            value={product.casePack ? `${product.casePack} units` : "—"}
          />
          <SpecItem label="Unit Volume" value={product.unitVolume || "—"} />
          <SpecItem label="Net Weight" value={product.netWeight || "—"} />
          <SpecItem label="ABV" value={product.abv ?? "—"} />
          <SpecItem label="Shelf Life" value={`${product.shelfLifeDays} days`} />
          <SpecItem
            label="Calories"
            value={product.calories === 0 ? "Zero" : String(product.calories)}
          />
        </div>
        {product.ingredients ? (
          <div className="stack" style={{ gap: 4, marginTop: 22 }}>
            <span className={styles.specLabel}>Ingredients</span>
            <p className="muted" style={{ maxWidth: "70ch" }}>
              {product.ingredients}
            </p>
          </div>
        ) : null}
      </section>

      <section className="card card-pad">
        <h2 className={styles.sectionTitle}>Pricing</h2>
        <div className={styles.specGrid}>
          <SpecItem label="Case Cost" value={formatCost(cost.costPerCase)} />
          <SpecItem label="Cost / Unit" value={formatCost(cost.costPerUnit)} />
          <SpecItem label="Cost / Oz" value={formatCost(cost.costPerOz, 4)} />
        </div>
        <div className="row" style={{ gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <a
            href={`/api/rep/pricing-sheet?slug=${encodeURIComponent(product.slug)}`}
            className="btn btn-outline btn-sm"
            download
          >
            <Download size={15} />
            Download pricing PDF
          </a>
          <SendPricingModal slug={product.slug} title={product.name} compact />
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Sell Sheets &amp; Assets</h2>
        {linkedAssets.length > 0 ? (
          <div className={styles.assetGrid}>
            {linkedAssets.map((a) => (
              <AssetCard key={a.id} asset={a} />
            ))}
          </div>
        ) : (
          <p className="muted">No sell sheets or assets linked to this product yet.</p>
        )}
      </section>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={styles.specLabel}>{label}</div>
      <div className={styles.specValue}>{value}</div>
    </div>
  );
}
