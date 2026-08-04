"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Upload } from "lucide-react";
import type { Asset, AssetType } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx, formatBytes } from "@/lib/utils";
import { AdminTable, type Column } from "./AdminTable";
import { AssetForm } from "./AssetForm";
import styles from "./ManageHeader.module.css";

const TYPE_LABEL: Record<AssetType, string> = {
  sell_sheet: "Sell sheet",
  pos: "POS",
  spec_sheet: "Spec sheet",
  logo: "Logo",
};

export function ManageAssets({ assets }: { assets: Asset[] }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return assets;
    return assets.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        TYPE_LABEL[a.type].toLowerCase().includes(q) ||
        a.fileType.toLowerCase().includes(q)
    );
  }, [assets, query]);

  const columns: Column<Asset>[] = [
    {
      key: "title",
      header: "Title",
      cell: (a) => (
        <div>
          <strong>{a.title}</strong>
          <div className="muted" style={{ fontSize: "0.78rem" }}>
            {a.description}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      cell: (a) => <Badge tone="neutral">{TYPE_LABEL[a.type]}</Badge>,
    },
    {
      key: "fileType",
      header: "File",
      cell: (a) => <span>{a.fileType}</span>,
    },
    {
      key: "size",
      header: "Size",
      cell: (a) => (
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatBytes(a.sizeBytes)}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.search}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="search"
            className={cx("field", styles.searchInput)}
            placeholder="Search assets…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search assets"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <Upload size={16} /> Upload asset
        </Button>
      </div>

      {showForm ? (
        <Card className={styles.formPanel}>
          <h2 className={styles.formTitle}>
            <Plus
              size={16}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }}
            />
            Upload asset
          </h2>
          <AssetForm onCancel={() => setShowForm(false)} />
        </Card>
      ) : null}

      <p className={styles.count} style={{ marginBottom: "0.6rem" }}>
        {rows.length} of {assets.length} assets
      </p>

      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(a) => a.id}
        emptyLabel="No assets match your search."
      />
    </>
  );
}
