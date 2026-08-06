import { defineField, defineType } from "sanity";

/**
 * Editorial/public content for a product. Gated business data (SKU, UPC,
 * case pack, net weight, ABV, ingredients, shelf life) stays in Supabase
 * Postgres behind RLS — never duplicate those fields here. This dataset is
 * public, so anything defined on this type is readable by anyone with the
 * project ID.
 *
 * Joined to the Supabase `products` row by `slug`.
 */
export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Must exactly match the slug in the Supabase products table — this is the join key between the two systems.",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Craft Soda",
          "Sparkling Hopwater",
          "Margarita Mix",
          "Sparkling Botanicals",
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Accent color",
      type: "string",
      description: "Hex color used to theme the product card, e.g. #2E8B54.",
    }),
    defineField({
      name: "image",
      title: "Product image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "calories",
      title: "Calories",
      type: "number",
    }),
    defineField({
      name: "isGlutenFree",
      title: "Gluten-free",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category", media: "image" },
  },
});
