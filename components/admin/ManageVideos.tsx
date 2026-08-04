"use client";

import { useMemo, useState } from "react";
import { Globe, Lock, Plus, Search } from "lucide-react";
import type { Video } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cx } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
import { AdminTable, type Column } from "./AdminTable";
import { VideoForm } from "./VideoForm";
import styles from "./ManageHeader.module.css";

const CATEGORY_LABEL: Record<Video["category"], string> = {
  brand: "Brand",
  product: "Product",
  training: "Training",
};

export function ManageVideos({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return videos;
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        CATEGORY_LABEL[v.category].toLowerCase().includes(q)
    );
  }, [videos, query]);

  const columns: Column<Video>[] = [
    {
      key: "title",
      header: "Title",
      cell: (v) => (
        <div>
          <strong>{v.title}</strong>
          <div className="muted" style={{ fontSize: "0.78rem" }}>
            {formatDuration(v.durationSeconds)}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      cell: (v) => <Badge tone="neutral">{CATEGORY_LABEL[v.category]}</Badge>,
    },
    {
      key: "access",
      header: "Access",
      cell: (v) =>
        v.access === "public" ? (
          <Badge tone="brand">
            <Globe size={12} /> Public
          </Badge>
        ) : (
          <Badge tone="coral">
            <Lock size={12} /> Rep-gated
          </Badge>
        ),
    },
    {
      key: "source",
      header: "Source",
      cell: (v) =>
        v.youtubeId ? (
          <span className="muted">YouTube · {v.youtubeId}</span>
        ) : (
          <span className="muted">{v.storagePath ?? "—"}</span>
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
            placeholder="Search videos…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search videos"
          />
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          <Plus size={16} /> Add video
        </Button>
      </div>

      {showForm ? (
        <Card className={styles.formPanel}>
          <h2 className={styles.formTitle}>Add video</h2>
          <VideoForm onCancel={() => setShowForm(false)} />
        </Card>
      ) : null}

      <p className={styles.count} style={{ marginBottom: "0.6rem" }}>
        {rows.length} of {videos.length} videos
      </p>

      <AdminTable
        columns={columns}
        rows={rows}
        rowKey={(v) => v.id}
        emptyLabel="No videos match your search."
      />
    </>
  );
}
