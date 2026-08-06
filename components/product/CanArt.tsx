import type { CSSProperties } from "react";
import type { Product } from "@/lib/types";
import { cx } from "@/lib/utils";
import styles from "./CanArt.module.css";

/**
 * CSS-drawn product "can" used everywhere we'd otherwise need product
 * photography. Themed by the product's accent color — reliable, on-brand,
 * and zero external image dependencies for the POC.
 */
export function CanArt({
  product,
  className,
}: {
  product: Pick<Product, "name" | "color" | "category">;
  className?: string;
}) {
  const style = {
    "--can": product.color,
    "--bg": `color-mix(in srgb, ${product.color} 16%, white)`,
  } as CSSProperties;

  const kind =
    product.category === "Sparkling Hopwater"
      ? "Hopwater"
      : product.category === "Margarita Mix"
        ? "Mixer"
        : product.category === "Sparkling Botanicals"
          ? "Botanical"
          : "Craft Soda";

  return (
    <div className={cx(styles.wrap, className)} style={style} aria-hidden>
      <div className={styles.can}>
        <span className={styles.label}>{product.name}</span>
        <span className={styles.kind}>{kind}</span>
      </div>
    </div>
  );
}
