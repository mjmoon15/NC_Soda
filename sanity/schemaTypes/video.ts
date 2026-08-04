import { defineField, defineType } from "sanity";

/**
 * Video metadata (title/description/thumbnail/access). This is safe to keep
 * public even for rep-gated videos: the metadata itself isn't sensitive, and
 * the actual gating happens server-side when minting a signed Mux playback
 * token (Phase 5) — the Mux playback ID alone can't be resolved to a
 * watchable URL without that signed token.
 */
export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["brand", "product", "training"] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "access",
      title: "Access",
      type: "string",
      options: { list: ["public", "rep"] },
      initialValue: "public",
      description:
        "Public videos embed from YouTube. Rep videos stream from Mux behind the rep/admin gate.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "youtubeId",
      title: "YouTube ID",
      type: "string",
      description: "Only for public videos.",
      hidden: ({ document }) => document?.access !== "public",
    }),
    defineField({
      name: "muxVideo",
      title: "Training video file",
      type: "mux.video",
      description:
        "Upload here for rep-gated videos. Uploaded with a signed playback policy — never publicly resolvable without a server-minted token.",
      hidden: ({ document }) => document?.access !== "rep",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "durationSeconds",
      title: "Duration (seconds)",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "access", media: "thumbnail" },
  },
});
