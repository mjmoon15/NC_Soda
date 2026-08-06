import Link from "next/link";
import { Leaf } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CanArt } from "@/components/product/CanArt";
import type { Product } from "@/lib/types";
import { CATEGORY_TONE } from "@/lib/categoryTone";
import styles from "./ProductCard.module.css";

/**
 * Public catalog card: CSS-drawn can, name, tagline, category badge, and
 * calorie note. Whole card links to the product detail page.
 */
export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={styles.card}
      aria-label={`${product.name} — ${product.category}`}
    >
      <div className={styles.art}>
        <CanArt product={product} />
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <Badge tone={CATEGORY_TONE[product.category]}>
            {product.category}
          </Badge>
          {product.isGlutenFree && (
            <span className={styles.gf}>
              <Leaf size={13} /> GF
            </span>
          )}
        </div>

        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.tagline}>{product.tagline}</p>

        <div className={styles.meta}>
          <span>
            {product.calories === 0 ? "Zero" : product.calories} cal
          </span>
          {product.unitVolume && (
            <>
              <span aria-hidden>·</span>
              <span>{product.unitVolume}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
