import { groq } from "next-sanity";

/**
 * GROQ reads for the app's public content. All of this is safe to fetch
 * unauthenticated — the dataset is public and nothing gated lives here (see
 * the schema file comments in ./sanity/schemaTypes).
 */

export const PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(name asc) {
    "id": _id,
    "slug": slug.current,
    name,
    tagline,
    description,
    category,
    color,
    "imageUrl": image.asset->url,
    calories,
    isGlutenFree,
    featured,
  }
`;

export const VIDEOS_QUERY = groq`
  *[_type == "video"] {
    "id": _id,
    title,
    description,
    category,
    access,
    youtubeId,
    "muxPlaybackId": muxVideo.asset->playbackId,
    "muxStatus": muxVideo.asset->status,
    "thumbnailUrl": thumbnail.asset->url,
    durationSeconds,
  }
`;

export const ASSETS_QUERY = groq`
  *[_type == "repAsset"] | order(title asc) {
    "id": _id,
    title,
    description,
    type,
    storagePath,
    fileType,
    sizeBytes,
    "productSlug": product->slug.current,
  }
`;

/** Single-asset read, storagePath included — used server-side by the
 * "Send to buyer" email flow to mint a fresh signed URL. Not used for any
 * public/rep listing (see ASSETS_QUERY for that). */
export const ASSET_BY_ID_QUERY = groq`
  *[_type == "repAsset" && _id == $id][0] {
    "id": _id,
    title,
    description,
    type,
    storagePath,
    fileType,
    sizeBytes,
  }
`;
