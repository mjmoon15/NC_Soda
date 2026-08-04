import { Clock, Lock, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Video } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import { TrainingVideoPlayer } from "./TrainingVideoPlayer";
import styles from "./GatedVideoCard.module.css";

/**
 * A rep-only training video. Streams from Mux via a signed playback token
 * minted server-side (see lib/mux/server.ts) after the rep/admin gate in
 * app/rep/layout.tsx has already passed. Falls back to a styled placeholder
 * when the video hasn't been uploaded to Mux yet, is still processing, or
 * Mux credentials aren't configured.
 */
export function GatedVideoCard({
  video,
  playbackToken,
}: {
  video: Video;
  playbackToken?: string | null;
}) {
  const canPlay = Boolean(
    video.muxPlaybackId && video.muxStatus === "ready" && playbackToken
  );

  return (
    <article className={`card ${styles.card}`} style={{ padding: 0 }}>
      {canPlay ? (
        <TrainingVideoPlayer
          playbackId={video.muxPlaybackId!}
          playbackToken={playbackToken!}
          title={video.title}
        />
      ) : (
        <div className={`dot-grid ${styles.thumb}`}>
          <span className={styles.lock}>
            <Lock size={12} />
            Rep-only
          </span>
          <span className={styles.play} aria-hidden>
            <Play size={22} fill="currentColor" />
          </span>
          <span className={styles.duration}>
            <Clock size={12} />
            {formatDuration(video.durationSeconds)}
          </span>
        </div>
      )}

      <div className={`card-pad stack ${styles.body}`}>
        <strong className={styles.title}>{video.title}</strong>
        <p className="muted" style={{ fontSize: "0.88rem" }}>
          {video.description}
        </p>
        {!canPlay && (
          <Badge tone="citrus" className={styles.statusBadge}>
            {video.muxPlaybackId
              ? video.muxStatus === "ready"
                ? "Mux credentials not configured on the server"
                : `processing in Mux (${video.muxStatus ?? "preparing"})…`
              : "upload a video in Studio to enable playback"}
          </Badge>
        )}
      </div>
    </article>
  );
}
