import Mux from "@mux/mux-node";
import {
  isMuxConfigured,
  MUX_SIGNING_KEY_ID,
  MUX_SIGNING_KEY_PRIVATE,
  MUX_TOKEN_ID,
  MUX_TOKEN_SECRET,
} from "@/lib/config";

/**
 * Server-only. Mints a short-lived signed playback token for a Mux asset
 * uploaded with a signed (private) playback policy — see
 * sanity/schemaTypes/video.ts and sanity.config.ts (muxInput plugin).
 *
 * Callers MUST have already verified hasAccess(user, "rep") — this function
 * does no auth check of its own, same pattern as Supabase's
 * createServiceSupabase() signed-URL helper.
 */
export async function signMuxPlaybackToken(
  playbackId: string
): Promise<string | null> {
  if (!isMuxConfigured) return null;

  const mux = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET });

  return mux.jwt.signPlaybackId(playbackId, {
    type: "video",
    expiration: "2h",
    keyId: MUX_SIGNING_KEY_ID,
    keySecret: MUX_SIGNING_KEY_PRIVATE,
  });
}
