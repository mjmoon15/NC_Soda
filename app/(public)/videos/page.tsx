import type { Metadata } from "next";
import { Clock } from "lucide-react";
import { LiteYouTube } from "@/components/video/LiteYouTube";
import { Badge } from "@/components/ui/Badge";
import { getPublicVideos } from "@/lib/data";
import type { Video, VideoCategory } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Videos",
  description:
    "Brand films and product explainers from New Creation Soda Works — share-ready and free to watch.",
};

const GROUPS: { category: VideoCategory; label: string; blurb: string }[] = [
  {
    category: "brand",
    label: "Brand films",
    blurb: "Who we are and why we make soda the hard way.",
  },
  {
    category: "product",
    label: "Product spotlights",
    blurb: "Short, share-ready clips on individual flavors and lines.",
  },
];

function VideoCard({ video }: { video: Video }) {
  return (
    <article className={styles.card}>
      {video.youtubeId ? (
        <LiteYouTube youtubeId={video.youtubeId} title={video.title} />
      ) : (
        <div className={styles.placeholder} aria-hidden />
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{video.title}</h3>
        <p className={styles.desc}>{video.description}</p>
        <span className={styles.duration}>
          <Clock size={13} /> {formatDuration(video.durationSeconds)}
        </span>
      </div>
    </article>
  );
}

export default async function VideosPage() {
  const videos = await getPublicVideos();

  return (
    <>
      <section className="dot-grid">
        <div className="container section" style={{ paddingBottom: 0 }}>
          <p className="eyebrow">Watch</p>
          <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.2rem)", margin: "0.5rem 0 0.75rem" }}>
            Video library
          </h1>
          <p className="lead" style={{ maxWidth: "46ch" }}>
            Our story and product explainers — free to watch and easy to share
            with customers.
          </p>
        </div>
      </section>

      <section className="container section stack" style={{ gap: "3.5rem" }}>
        {GROUPS.map((group) => {
          const items = videos.filter((v) => v.category === group.category);
          if (items.length === 0) return null;
          return (
            <div key={group.category}>
              <div className={styles.groupHead}>
                <h2 style={{ margin: 0 }}>
                  <Badge tone={group.category === "brand" ? "coral" : "brand"}>
                    {group.label}
                  </Badge>
                </h2>
                <p className="muted" style={{ fontSize: "0.92rem" }}>
                  {group.blurb}
                </p>
              </div>
              <div className={styles.grid}>
                {items.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
