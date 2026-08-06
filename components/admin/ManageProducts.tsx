"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/utils";
import { CATEGORY_TONE } from "@/lib/categoryTone";
import { ProductForm } from "./ProductForm";
import tableStyles from "./AdminTable.module.css";
import styles from "./ManageHeader.module.css";

type SortKey = "name" | "category" | "sku";

export function ManageProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [asc, setAsc] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
      : products.slice();
    filtered.sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return asc ? cmp : -cmp;
    });
    return filtered;
  }, [products, query, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.search}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={cx("field", styles.searchInput)}
            placeholder="Search by name, SKU, or category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <Plus size={16} /> New product
        </Button>
      </div>

      {showForm ? (
        <Card className={styles.formPanel}>
          <h2 className={styles.formTitle}>New product</h2>
          <ProductForm onCancel={() => setShowForm(false)} />
        </Card>
      ) : null}

      <p className={styles.count} style={{ marginBottom: "0.6rem" }}>
        {rows.length} of {products.length} products
      </p>

      <div className={cx("card", tableStyles.wrap)}>
        <table className={cx("table", tableStyles.table)}>
          <thead>
            <tr>
              <SortableTh
                label="Name"
                k="name"
                sortKey={sortKey}
                asc={asc}
                onSort={toggleSort}
              />
              <SortableTh
                label="Category"
                k="category"
                sortKey={sortKey}
                asc={asc}
                onSort={toggleSort}
              />
              <SortableTh
                label="SKU"
                k="sku"
                sortKey={sortKey}
                asc={asc}
                onSort={toggleSort}
              />
              <th>Featured</th>
              <th className={tableStyles.actionsCol}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={tableStyles.empty}>
                    No products match your search.
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div className="muted" style={{ fontSize: "0.78rem" }}>
                      {p.tagline}
                    </div>
                  </td>
                  <td>
                    <Badge tone={CATEGORY_TONE[p.category]}>{p.category}</Badge>
                  </td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.sku}</td>
                  <td>
                    {p.featured ? (
                      <Badge tone="citrus">
                        <Star size={12} /> Featured
                      </Badge>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className={tableStyles.actionsCol}>
                    <Button variant="ghost" size="sm" type="button">
                      <Pencil size={14} /> Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SortableTh({
  label,
  k,
  sortKey,
  asc,
  onSort,
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onSort: (k: SortKey) => void;
}) {
  const active = sortKey === k;
  return (
    <th aria-sort={active ? (asc ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        className={cx(styles.sortBtn, active && styles.sortActive)}
        onClick={() => onSort(k)}
      >
        {label}
        {active ? asc ? <ArrowUp size={12} /> : <ArrowDown size={12} /> : null}
      </button>
    </th>
  );
}
