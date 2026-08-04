"use client";

import MuxPlayer from "@mux/mux-player-react";

/**
 * Thin client wrapper around Mux Player. Split out from GatedVideoCard (a
 * server component) since the player needs the browser.
 */
export function TrainingVideoPlayer({
  playbackId,
  playbackToken,
  title,
}: {
  playbackId: string;
  playbackToken: string;
  title: string;
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      tokens={{ playback: playbackToken }}
      metadata={{ video_title: title }}
      streamType="on-demand"
      style={{ width: "100%", aspectRatio: "16 / 9", display: "block" }}
    />
  );
}
