import type { Metadata } from "next";
import { GatedVideoCard } from "@/components/rep/GatedVideoCard";
import { getTrainingVideos } from "@/lib/data";
import { signMuxPlaybackToken } from "@/lib/mux/server";

export const metadata: Metadata = { title: "Training · Rep Portal" };

export default async function TrainingPage() {
  const videos = await getTrainingVideos();

  // Reached this page => app/rep/layout.tsx already verified hasAccess(user,
  // "rep"). Safe to mint signed Mux tokens here.
  const withTokens = await Promise.all(
    videos.map(async (video) => ({
      video,
      playbackToken:
        video.muxPlaybackId && video.muxStatus === "ready"
          ? await signMuxPlaybackToken(video.muxPlaybackId)
          : null,
    }))
  );

  return (
    <div className="stack" style={{ gap: 20 }}>
      <header className="stack" style={{ gap: 6 }}>
        <span className="eyebrow">Rep-Only</span>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Training</h1>
        <p className="lead" style={{ maxWidth: "56ch" }}>
          Cooler sets, buyer pitches, and margin math — short, practical
          walkthroughs to sharpen your sell.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {withTokens.map(({ video, playbackToken }) => (
          <GatedVideoCard key={video.id} video={video} playbackToken={playbackToken} />
        ))}
      </div>
    </div>
  );
}
