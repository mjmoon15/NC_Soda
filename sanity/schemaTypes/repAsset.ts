import { defineField, defineType } from "sanity";

/**
 * Editorial metadata for a downloadable rep asset (sell sheet, POS art, spec
 * sheet, logo pack). The actual file stays in a private Supabase Storage
 * bucket, served via a server-minted signed URL after the rep/admin auth
 * check (Phase 6) — never upload the gated file itself here, since this
 * dataset is public.
 */
export const repAsset = defineType({
  name: "repAsset",
  title: "Sell Sheet / Asset",
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
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: ["sell_sheet", "pos", "spec_sheet", "logo"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storagePath",
      title: "Supabase Storage path",
      type: "string",
      description:
        'Path within the private "assets" bucket, e.g. assets/parakey-sell-sheet.pdf. Wired to a signed URL server-side (Phase 6) — leave blank until the file is uploaded to Storage.',
    }),
    defineField({
      name: "fileType",
      title: "File type",
      type: "string",
      description: "e.g. PDF, PNG, ZIP",
    }),
    defineField({
      name: "sizeBytes",
      title: "File size (bytes)",
      type: "number",
      description: "Shown on the asset card, e.g. 1240000 for ~1.2 MB.",
    }),
    defineField({
      name: "product",
      title: "Related product",
      type: "reference",
      to: [{ type: "product" }],
      description: "Optional link to a specific product.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type" },
  },
});
