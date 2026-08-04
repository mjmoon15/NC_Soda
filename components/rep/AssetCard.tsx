"use client";

import { useState } from "react";
import { Check, Download, Info } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Asset } from "@/lib/types";
import { formatBytes } from "@/lib/utils";
import styles from "./AssetCard.module.css";

/**
 * A single downloadable marketing asset. In demo mode the fileUrl is a
 * placeholder (`#demo-asset`), so the Download button surfaces an inline note
 * instead of triggering a (non-existent) download. Once Supabase Storage is
 * connected the button links straight to a signed URL.
 */
export function AssetCard({ asset }: { asset: Asset }) {
  const [noted, setNoted] = useState(false);
  const isDemoAsset = !asset.fileUrl || asset.fileUrl.startsWith("#");

  return (
    <div className={`card card-pad ${styles.card}`}>
      <div className={styles.top}>
        <span className={styles.fileType}>{asset.fileType}</span>
        <Badge tone="neutral">{formatBytes(asset.sizeBytes)}</Badge>
      </div>

      <div className="stack" style={{ gap: 4, flex: 1 }}>
        <strong className={styles.title}>{asset.title}</strong>
        <p className="muted" style={{ fontSize: "0.88rem" }}>
          {asset.description}
        </p>
      </div>

      {isDemoAsset ? (
        <>
          <button
            type="button"
            className="btn btn-outline btn-sm btn-block"
            onClick={() => setNoted(true)}
          >
            {noted ? <Check size={15} /> : <Download size={15} />}
            {noted ? "Activates with Storage" : "Download"}
          </button>
          {noted && (
            <p className={styles.note}>
              <Info size={13} />
              Downloads activate once Supabase Storage is connected.
            </p>
          )}
        </>
      ) : (
        <a
          href={asset.fileUrl}
          className="btn btn-primary btn-sm btn-block"
          download
        >
          <Download size={15} />
          Download
        </a>
      )}
    </div>
  );
}
