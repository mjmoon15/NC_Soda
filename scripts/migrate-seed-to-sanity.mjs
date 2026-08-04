/**
 * One-time migration: pushes the seed catalog (products/videos/assets) into
 * Sanity as real documents. Uses deterministic _id values so re-running this
 * is safe (createOrReplace, not create) — it won't duplicate anything.
 *
 * Usage:
 *   node --env-file=.env.local scripts/migrate-seed-to-sanity.mjs
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and a
 * write-enabled SANITY_API_TOKEN in .env.local.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN.\n" +
      "Run with: node --env-file=.env.local scripts/migrate-seed-to-sanity.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-08-04",
  useCdn: false,
});

/* ── seed content (mirrors lib/data/mock.ts) ─────────────────────────── */

const products = [
  {
    slug: "parakey-key-lime-pie",
    name: "Parakey",
    tagline: "Key lime pie in a can, baby.",
    description:
      "Bright key lime, a graham-cracker whisper, and just enough cream soda roundness. Tart, nostalgic, dangerously drinkable.",
    category: "Craft Soda",
    color: "#7FC397",
    calories: 90,
    isGlutenFree: true,
    featured: true,
  },
  {
    slug: "root-42-root-beer",
    name: "Root 42",
    tagline: "Old-time root beer, new-school clean.",
    description:
      "Deep sassafras-style spice, a slow vanilla finish, and a creamy head. The one your granddad would steal from your cooler.",
    category: "Craft Soda",
    color: "#8A5A33",
    calories: 110,
    isGlutenFree: true,
    featured: true,
  },
  {
    slug: "hopfin-citra-hopwater",
    name: "Hopfin · Citra",
    tagline: "All the hops, zero proof.",
    description:
      "Dry-hopped sparkling water with Citra hops — juicy grapefruit and passionfruit aromatics, no sugar, no calories, no buzz.",
    category: "Sparkling Hopwater",
    color: "#4FA66F",
    calories: 0,
    isGlutenFree: true,
    featured: true,
  },
  {
    slug: "hopfin-mosaic-hopwater",
    name: "Hopfin · Mosaic",
    tagline: "Stone-fruit fizz, fully sober.",
    description:
      "Mosaic hops bring peach, blueberry, and a soft pine lift. Crisp, bone-dry, and built for the back nine.",
    category: "Sparkling Hopwater",
    color: "#2E8B54",
    calories: 0,
    isGlutenFree: true,
    featured: false,
  },
  {
    slug: "margarita-mix-classic-lime",
    name: "Classic Lime Margarita Mix",
    tagline: "Just add tequila (we won't tell).",
    description:
      "Real lime juice, agave, and a pinch of sea salt. No neon, no high-fructose anything — a bar-quality marg in two seconds.",
    category: "Margarita Mix",
    color: "#F6B53F",
    calories: 70,
    isGlutenFree: true,
    featured: true,
  },
  {
    slug: "margarita-mix-spicy-mango",
    name: "Spicy Mango Margarita Mix",
    tagline: "Sweet heat in a bottle.",
    description:
      "Ripe mango and lime with a slow jalapeño build. Sweet up front, gently spicy on the finish.",
    category: "Margarita Mix",
    color: "#E85575",
    calories: 80,
    isGlutenFree: true,
    featured: false,
  },
  {
    slug: "sunfizz-orange-cream",
    name: "Sunfizz",
    tagline: "Orange cream, all grown up.",
    description:
      "Sun-ripened orange over a velvety vanilla base. The creamsicle you remember, made with cane sugar and real juice.",
    category: "Craft Soda",
    color: "#F8C75A",
    calories: 100,
    isGlutenFree: true,
    featured: false,
  },
  {
    slug: "wildcard-cherry-cola",
    name: "Wildcard",
    tagline: "Cherry cola with a wink.",
    description:
      "Dark cherry layered over a craft cola base with warm baking spice. Bold, fizzy, and a little mysterious.",
    category: "Craft Soda",
    color: "#E85575",
    calories: 120,
    isGlutenFree: true,
    featured: false,
  },
];

const videos = [
  {
    id: "v_brand_story",
    title: "Our Story: From Garage to Grocery",
    description:
      "How two brothers turned a backyard carbonation rig into a craft soda label stocked across the Southeast.",
    category: "brand",
    access: "public",
    youtubeId: "ScMzIvxBSi4",
    durationSeconds: 132,
  },
  {
    id: "v_parakey_spot",
    title: "Parakey — Key Lime Pie in a Can",
    description: "30-second hero spot for our flagship key lime cream soda.",
    category: "product",
    access: "public",
    youtubeId: "aqz-KE-bpKQ",
    durationSeconds: 31,
  },
  {
    id: "v_hopfin_explainer",
    title: "What Is Hopwater, Anyway?",
    description:
      "A 60-second explainer on dry-hopped sparkling water — perfect to share with curious customers.",
    category: "product",
    access: "public",
    youtubeId: "ysz5S6PUM-U",
    durationSeconds: 64,
  },
  {
    id: "v_train_merch",
    title: "Training: Building the Perfect Cooler Set",
    description:
      "Step-by-step planogram walkthrough for reps setting a New Creation cooler door. Rep-only.",
    category: "training",
    access: "rep",
    durationSeconds: 412,
  },
  {
    id: "v_train_pitch",
    title: "Training: The 90-Second Buyer Pitch",
    description:
      "Our proven pitch for landing a new account, including objection handling. Rep-only.",
    category: "training",
    access: "rep",
    durationSeconds: 96,
  },
  {
    id: "v_train_margins",
    title: "Training: Talking Margins & Case Math",
    description:
      "How to walk a buyer through unit economics and case pack pricing with confidence. Rep-only.",
    category: "training",
    access: "rep",
    durationSeconds: 305,
  },
];

const assets = [
  {
    id: "a_parakey_sell",
    title: "Parakey Sell Sheet",
    description: "One-pager: flavor profile, specs, and shelf talkers.",
    type: "sell_sheet",
    fileType: "PDF",
    sizeBytes: 1_240_000,
    productSlug: "parakey-key-lime-pie",
  },
  {
    id: "a_hopfin_sell",
    title: "Hopfin Hopwater Sell Sheet",
    description: "Citra + Mosaic line overview with zero-proof talking points.",
    type: "sell_sheet",
    fileType: "PDF",
    sizeBytes: 1_510_000,
    productSlug: "hopfin-citra-hopwater",
  },
  {
    id: "a_line_catalog",
    title: "Full Line Catalog 2026",
    description: "Every SKU, case pack, and UPC in one printable catalog.",
    type: "spec_sheet",
    fileType: "PDF",
    sizeBytes: 4_820_000,
  },
  {
    id: "a_pos_cooler_cling",
    title: "Cooler Door Clings (Print-Ready)",
    description: "Static cling artwork sized for standard reach-in doors.",
    type: "pos",
    fileType: "ZIP",
    sizeBytes: 22_400_000,
  },
  {
    id: "a_pos_shelf_talkers",
    title: "Shelf Talkers — Full Line",
    description: "Print-and-clip shelf talkers for every flavor.",
    type: "pos",
    fileType: "PDF",
    sizeBytes: 6_100_000,
  },
  {
    id: "a_logo_pack",
    title: "Brand Logo Pack",
    description: "Primary, stacked, and mono logos in SVG + PNG.",
    type: "logo",
    fileType: "ZIP",
    sizeBytes: 3_300_000,
  },
  {
    id: "a_marg_sell",
    title: "Margarita Mix Sell Sheet",
    description: "Classic Lime + Spicy Mango with serve suggestions.",
    type: "sell_sheet",
    fileType: "PDF",
    sizeBytes: 1_330_000,
    productSlug: "margarita-mix-classic-lime",
  },
];

/* ── run ──────────────────────────────────────────────────────────────── */

function slugify(id) {
  return id.replace(/_/g, "-");
}

async function run() {
  console.log("Cleaning up any manually-created test docs...");
  const dupeIds = await client.fetch(
    `*[_type == "product" && slug.current in $slugs && _id != "product-" + slug.current]._id`,
    { slugs: products.map((p) => p.slug) }
  );
  for (const id of dupeIds) {
    await client.delete(id);
    console.log(`  ✓ removed duplicate ${id}`);
  }

  console.log("Migrating products...");
  for (const p of products) {
    await client.createOrReplace({
      _id: `product-${p.slug}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.slug },
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      color: p.color,
      calories: p.calories,
      isGlutenFree: p.isGlutenFree,
      featured: p.featured,
    });
    console.log(`  ✓ ${p.name}`);
  }

  console.log("Migrating videos...");
  for (const v of videos) {
    const doc = {
      _id: `video-${slugify(v.id)}`,
      _type: "video",
      title: v.title,
      description: v.description,
      category: v.category,
      access: v.access,
      durationSeconds: v.durationSeconds,
    };
    if (v.youtubeId) doc.youtubeId = v.youtubeId;
    await client.createOrReplace(doc);
    console.log(`  ✓ ${v.title}`);
  }

  console.log("Migrating assets...");
  for (const a of assets) {
    const doc = {
      _id: `asset-${slugify(a.id)}`,
      _type: "repAsset",
      title: a.title,
      description: a.description,
      type: a.type,
      fileType: a.fileType,
      sizeBytes: a.sizeBytes,
    };
    if (a.productSlug) {
      doc.product = {
        _type: "reference",
        _ref: `product-${a.productSlug}`,
      };
    }
    await client.createOrReplace(doc);
    console.log(`  ✓ ${a.title}`);
  }

  console.log("\nDone. 8 products, 6 videos, 7 assets migrated.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
