"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product, ProductCategory } from "@/lib/types";
import { cx } from "@/lib/utils";
import styles from "./ProductCatalog.module.css";

type Filter = "All" | ProductCategory;

const TABS: Filter[] = [
  "All",
  "Craft Soda",
  "Sparkling Hopwater",
  "Margarita Mix",
];

/**
 * Client-side category filter for the public catalog. Products are passed in
 * from the server page; filtering is purely in-memory (no refetch).
 */
export function ProductCatalog({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Filter>("All");

  const visible = useMemo(
    () =>
      active === "All"
        ? products
        : products.filter((p) => p.category === active),
    [active, products]
  );

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="Filter by category">
        {TABS.map((tab) => {
          const count =
            tab === "All"
              ? products.length
              : products.filter((p) => p.category === tab).length;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={active === tab}
              className={cx(styles.tab, active === tab && styles.tabActive)}
              onClick={() => setActive(tab)}
            >
              {tab}
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="muted" style={{ marginTop: "2rem" }}>
          No products in this category yet.
        </p>
      ) : (
        <div className={styles.grid}>
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
