"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";
import type { Product } from "@/lib/types";
import { computeCostMetrics, formatCost } from "@/lib/pricing";
import { cx } from "@/lib/utils";
import styles from "./ProductTable.module.css";

type SortKey = "name" | "category" | "sku" | "casePack" | "shelfLifeDays";
type SortDir = "asc" | "desc";

const ALL = "All categories";

/** Filter products by a free-text query (name / sku / upc / case upc). */
export function filterProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.name, p.sku, p.upc, p.caseUpc].some((f) =>
      f.toLowerCase().includes(q)
    )
  );
}

/** Stable sort by a column key + direction. Returns a new array. */
export function sortProducts(
  products: Product[],
  key: SortKey,
  dir: SortDir
): Product[] {
  const sign = dir === "asc" ? 1 : -1;
  return [...products].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (typeof av === "number" && typeof bv === "number") {
      return (av - bv) * sign;
    }
    return String(av).localeCompare(String(bv)) * sign;
  });
}

export function ProductTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>(ALL);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const rows = useMemo(() => {
    const byCategory =
      category === ALL
        ? products
        : products.filter((p) => p.category === category);
    return sortProducts(filterProducts(byCategory, query), sortKey, sortDir);
  }, [products, category, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (col !== sortKey)
      return <ChevronsUpDown size={13} className={styles.sortIcon} />;
    return sortDir === "asc" ? (
      <ArrowUp size={13} className={styles.sortIconActive} />
    ) : (
      <ArrowDown size={13} className={styles.sortIconActive} />
    );
  }

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={`field ${styles.search}`}
            placeholder="Search by name, SKU, or UPC…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <select
          className={`field ${styles.select}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className={`muted ${styles.count}`}>
          {rows.length} {rows.length === 1 ? "product" : "products"}
        </span>
      </div>

      <div className={`card ${styles.tableCard}`} style={{ padding: 0 }}>
        <div className={styles.scroll}>
          <table className="table">
            <thead>
              <tr>
                <th>
                  <button
                    className={styles.th}
                    onClick={() => toggleSort("name")}
                    type="button"
                  >
                    Product <SortIcon col="name" />
                  </button>
                </th>
                <th>
                  <button
                    className={styles.th}
                    onClick={() => toggleSort("category")}
                    type="button"
                  >
                    Category <SortIcon col="category" />
                  </button>
                </th>
                <th>
                  <button
                    className={styles.th}
                    onClick={() => toggleSort("sku")}
                    type="button"
                  >
                    SKU <SortIcon col="sku" />
                  </button>
                </th>
                <th>UPC</th>
                <th>Case UPC</th>
                <th>
                  <button
                    className={styles.th}
                    onClick={() => toggleSort("casePack")}
                    type="button"
                  >
                    Case Pack <SortIcon col="casePack" />
                  </button>
                </th>
                <th>Unit Vol</th>
                <th>Net Wt</th>
                <th>ABV</th>
                <th>
                  <button
                    className={styles.th}
                    onClick={() => toggleSort("shelfLifeDays")}
                    type="button"
                  >
                    Shelf Life <SortIcon col="shelfLifeDays" />
                  </button>
                </th>
                <th>Case Cost</th>
                <th>Cost/Unit</th>
                <th>Cost/Oz</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const cost = computeCostMetrics(p);
                return (
                  <tr key={p.id}>
                    <td className={styles.nameCell}>
                      <span className={styles.productCell}>
                        <span
                          className={styles.swatch}
                          style={{ background: p.color }}
                          aria-hidden
                        />
                        <strong>{p.name}</strong>
                      </span>
                    </td>
                    <td className="muted" data-label="Category">
                      {p.category}
                    </td>
                    <td className={styles.mono} data-label="SKU">
                      {p.sku}
                    </td>
                    <td className={styles.mono} data-label="UPC">
                      {p.upc}
                    </td>
                    <td className={styles.mono} data-label="Case UPC">
                      {p.caseUpc}
                    </td>
                    <td data-label="Case Pack">{p.casePack}</td>
                    <td data-label="Unit Vol">{p.unitVolume}</td>
                    <td data-label="Net Wt">{p.netWeight}</td>
                    <td data-label="ABV">{p.abv ?? "—"}</td>
                    <td data-label="Shelf Life">{p.shelfLifeDays} days</td>
                    <td className={styles.mono} data-label="Case Cost">
                      {formatCost(cost.costPerCase)}
                    </td>
                    <td className={styles.mono} data-label="Cost/Unit">
                      {formatCost(cost.costPerUnit)}
                    </td>
                    <td className={styles.mono} data-label="Cost/Oz">
                      {formatCost(cost.costPerOz, 4)}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={13} className={styles.empty}>
                    No products match “{query}”
                    {category !== ALL ? ` in ${category}` : ""}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
