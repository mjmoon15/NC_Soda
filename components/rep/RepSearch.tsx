"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Boxes, FileText, GraduationCap, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./RepSearch.module.css";

export type SearchKind = "product" | "asset" | "training";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  detail: string;
  href: string;
  /** strings matched against the query (name, sku, upc, description, …) */
  keywords: string[];
}

const GROUP_ORDER: SearchKind[] = ["product", "asset", "training"];

const GROUP_META: Record<
  SearchKind,
  { label: string; icon: LucideIcon }
> = {
  product: { label: "Products", icon: Boxes },
  asset: { label: "Sell Sheets & POS", icon: FileText },
  training: { label: "Training", icon: GraduationCap },
};

/** Filter items whose title or any keyword contains every whitespace token. */
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return items;
  return items.filter((item) => {
    const hay = [item.title, ...item.keywords].join(" ").toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}

export function RepSearch({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchItems(items, query), [items, query]);

  const grouped = useMemo(() => {
    const map: Record<SearchKind, SearchItem[]> = {
      product: [],
      asset: [],
      training: [],
    };
    for (const r of results) map[r.kind].push(r);
    return map;
  }, [results]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className={styles.searchWrap}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="search"
          className={`field ${styles.search}`}
          placeholder="Search products, sell sheets, training…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search the rep portal"
          autoFocus
        />
      </div>

      {hasQuery && (
        <p className={`muted ${styles.count}`}>
          {results.length} {results.length === 1 ? "result" : "results"} for “
          {query.trim()}”
        </p>
      )}

      {results.length === 0 ? (
        <div className={`card card-pad ${styles.empty}`}>
          No results{hasQuery ? ` for “${query.trim()}”` : ""}. Try a product
          name, SKU, or asset title.
        </div>
      ) : (
        <div className="stack" style={{ gap: 26 }}>
          {GROUP_ORDER.map((kind) => {
            const group = grouped[kind];
            if (group.length === 0) return null;
            const meta = GROUP_META[kind];
            const Icon = meta.icon;
            return (
              <section key={kind} className="stack" style={{ gap: 10 }}>
                <div className={styles.groupHead}>
                  <Icon size={16} />
                  <span className={styles.groupLabel}>{meta.label}</span>
                  <span className={styles.groupCount}>{group.length}</span>
                </div>
                <ul className={styles.list}>
                  {group.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cx("card card-pad", styles.result)}
                      >
                        <span
                          className={cx(styles.kindDot, styles[`dot_${kind}`])}
                          aria-hidden
                        />
                        <span className="stack" style={{ gap: 2 }}>
                          <strong className={styles.resultTitle}>
                            {item.title}
                          </strong>
                          <span className="muted" style={{ fontSize: "0.85rem" }}>
                            {item.detail}
                          </span>
                        </span>
                        <span className={styles.resultMeta}>{item.subtitle}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
