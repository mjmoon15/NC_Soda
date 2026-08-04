import type { Metadata } from "next";
import { ManageVideos } from "@/components/admin/ManageVideos";
import { getAllVideos } from "@/lib/data";

export const metadata: Metadata = { title: "Admin · Videos" };

export default async function AdminVideosPage() {
  const videos = await getAllVideos();

  return (
    <div className="stack" style={{ gap: "1.25rem" }}>
      <header>
        <p className="eyebrow">Media</p>
        <h1 style={{ fontSize: "1.7rem", marginBlock: "0.3rem 0.3rem" }}>
          Videos
        </h1>
        <p className="muted" style={{ fontSize: "0.95rem" }}>
          Public brand and product spots plus rep-gated training content.
        </p>
      </header>

      <ManageVideos videos={videos} />
    </div>
  );
}
