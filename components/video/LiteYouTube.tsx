"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cx } from "@/lib/utils";
import styles from "./LiteYouTube.module.css";

/**
 * Lightweight YouTube embed: shows the thumbnail until clicked, then swaps in
 * the iframe. Keeps the public video hub fast (no YouTube JS until play).
 */
export function LiteYouTube({
  youtubeId,
  title,
  className,
}: {
  youtubeId: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className={cx(styles.frame, className)}>
      {playing ? (
        <iframe
          className={styles.iframe}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.button}
          style={{ backgroundImage: `url(${thumb})` }}
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
        >
          <span className={styles.scrim} />
          <span className={styles.play}>
            <Play size={26} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
