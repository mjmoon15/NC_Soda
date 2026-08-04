-- ============================================================================
-- 0003_seed.sql — seed content, mirrored 1:1 from lib/data/mock.ts.
-- Same ids and slugs (tests + links reference some by slug). Idempotent via
-- ON CONFLICT so it is safe to re-run.
-- ============================================================================

-- ── products ──────────────────────────────────────────────────────────────────
insert into public.products (
  id, slug, name, tagline, description, category, color, image_url,
  calories, is_gluten_free, featured,
  sku, upc, case_upc, case_pack, unit_volume, net_weight, abv,
  ingredients, shelf_life_days
) values
  (
    'p_parakey', 'parakey-key-lime-pie', 'Parakey', 'Key lime pie in a can, baby.',
    'Bright key lime, a graham-cracker whisper, and just enough cream soda roundness. Tart, nostalgic, dangerously drinkable.',
    'Craft Soda', '#7FC397', '',
    90, true, true,
    'NCS-CS-001', '860000000017', '10860000000014', 12, '12 fl oz', '9.4 lb / case', null,
    'Carbonated water, cane sugar, lime juice, natural key lime & vanilla flavor, citric acid.', 365
  ),
  (
    'p_root42', 'root-42-root-beer', 'Root 42', 'Old-time root beer, new-school clean.',
    'Deep sassafras-style spice, a slow vanilla finish, and a creamy head. The one your granddad would steal from your cooler.',
    'Craft Soda', '#8A5A33', '',
    110, true, true,
    'NCS-CS-002', '860000000024', '10860000000021', 12, '12 fl oz', '9.4 lb / case', null,
    'Carbonated water, cane sugar, natural root beer flavor, vanilla extract, caramel color.', 365
  ),
  (
    'p_hopfin_citra', 'hopfin-citra-hopwater', 'Hopfin · Citra', 'All the hops, zero proof.',
    'Dry-hopped sparkling water with Citra hops — juicy grapefruit and passionfruit aromatics, no sugar, no calories, no buzz.',
    'Sparkling Hopwater', '#4FA66F', '',
    0, true, true,
    'NCS-HW-001', '860000000031', '10860000000038', 24, '12 fl oz', '18.1 lb / case', '0.0% ABV',
    'Carbonated water, Citra hops, natural hop extract.', 270
  ),
  (
    'p_hopfin_mosaic', 'hopfin-mosaic-hopwater', 'Hopfin · Mosaic', 'Stone-fruit fizz, fully sober.',
    'Mosaic hops bring peach, blueberry, and a soft pine lift. Crisp, bone-dry, and built for the back nine.',
    'Sparkling Hopwater', '#2E8B54', '',
    0, true, false,
    'NCS-HW-002', '860000000048', '10860000000045', 24, '12 fl oz', '18.1 lb / case', '0.0% ABV',
    'Carbonated water, Mosaic hops, natural hop extract.', 270
  ),
  (
    'p_marg_classic', 'margarita-mix-classic-lime', 'Classic Lime Margarita Mix', 'Just add tequila (we won''t tell).',
    'Real lime juice, agave, and a pinch of sea salt. No neon, no high-fructose anything — a bar-quality marg in two seconds.',
    'Margarita Mix', '#F6B53F', '',
    70, true, true,
    'NCS-MM-001', '860000000055', '10860000000052', 6, '32 fl oz', '13.8 lb / case', null,
    'Filtered water, lime juice, organic agave, natural flavor, sea salt.', 540
  ),
  (
    'p_marg_spicy', 'margarita-mix-spicy-mango', 'Spicy Mango Margarita Mix', 'Sweet heat in a bottle.',
    'Ripe mango and lime with a slow jalapeño build. Sweet up front, gently spicy on the finish.',
    'Margarita Mix', '#E85575', '',
    80, true, false,
    'NCS-MM-002', '860000000062', '10860000000069', 6, '32 fl oz', '13.8 lb / case', null,
    'Filtered water, mango puree, lime juice, organic agave, jalapeño, natural flavor.', 540
  ),
  (
    'p_orange_cream', 'sunfizz-orange-cream', 'Sunfizz', 'Orange cream, all grown up.',
    'Sun-ripened orange over a velvety vanilla base. The creamsicle you remember, made with cane sugar and real juice.',
    'Craft Soda', '#F8C75A', '',
    100, true, false,
    'NCS-CS-003', '860000000079', '10860000000076', 12, '12 fl oz', '9.4 lb / case', null,
    'Carbonated water, cane sugar, orange juice, natural orange & vanilla flavor, citric acid.', 365
  ),
  (
    'p_cherry_cola', 'wildcard-cherry-cola', 'Wildcard', 'Cherry cola with a wink.',
    'Dark cherry layered over a craft cola base with warm baking spice. Bold, fizzy, and a little mysterious.',
    'Craft Soda', '#E85575', '',
    120, true, false,
    'NCS-CS-004', '860000000086', '10860000000083', 12, '12 fl oz', '9.4 lb / case', null,
    'Carbonated water, cane sugar, cherry juice, natural cola & cherry flavor, caramel color, citric acid.', 365
  )
on conflict (id) do nothing;

-- ── videos ──────────────────────────────────────────────────────────────────────
-- Public videos carry youtube_id; rep/training videos carry storage_path (no
-- youtube_id) and stream from the private 'training' bucket via a signed URL.
insert into public.videos (
  id, title, description, category, access, youtube_id, storage_path, thumbnail_url, duration_seconds
) values
  (
    'v_brand_story', 'Our Story: From Garage to Grocery',
    'How two brothers turned a backyard carbonation rig into a craft soda label stocked across the Southeast.',
    'brand', 'public', 'ScMzIvxBSi4', null, 'https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg', 132
  ),
  (
    'v_parakey_spot', 'Parakey — Key Lime Pie in a Can',
    '30-second hero spot for our flagship key lime cream soda.',
    'product', 'public', 'aqz-KE-bpKQ', null, 'https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg', 31
  ),
  (
    'v_hopfin_explainer', 'What Is Hopwater, Anyway?',
    'A 60-second explainer on dry-hopped sparkling water — perfect to share with curious customers.',
    'product', 'public', 'ysz5S6PUM-U', null, 'https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg', 64
  ),
  (
    'v_train_merch', 'Training: Building the Perfect Cooler Set',
    'Step-by-step planogram walkthrough for reps setting a New Creation cooler door. Rep-only.',
    'training', 'rep', null, 'training/cooler-set-walkthrough.mp4', '', 412
  ),
  (
    'v_train_pitch', 'Training: The 90-Second Buyer Pitch',
    'Our proven pitch for landing a new account, including objection handling. Rep-only.',
    'training', 'rep', null, 'training/buyer-pitch.mp4', '', 96
  ),
  (
    'v_train_margins', 'Training: Talking Margins & Case Math',
    'How to walk a buyer through unit economics and case pack pricing with confidence. Rep-only.',
    'training', 'rep', null, 'training/margins-and-case-math.mp4', '', 305
  )
on conflict (id) do nothing;

-- ── assets ────────────────────────────────────────────────────────────────────
-- file_url in seed is the demo placeholder '#demo-asset'; in production the app
-- mints a signed Storage URL server-side (see supabase/storage.md). All rep-gated.
insert into public.assets (
  id, title, description, type, file_url, file_type, size_bytes, product_slug, access
) values
  (
    'a_parakey_sell', 'Parakey Sell Sheet',
    'One-pager: flavor profile, specs, and shelf talkers.',
    'sell_sheet', '#demo-asset', 'PDF', 1240000, 'parakey-key-lime-pie', 'rep'
  ),
  (
    'a_hopfin_sell', 'Hopfin Hopwater Sell Sheet',
    'Citra + Mosaic line overview with zero-proof talking points.',
    'sell_sheet', '#demo-asset', 'PDF', 1510000, 'hopfin-citra-hopwater', 'rep'
  ),
  (
    'a_line_catalog', 'Full Line Catalog 2026',
    'Every SKU, case pack, and UPC in one printable catalog.',
    'spec_sheet', '#demo-asset', 'PDF', 4820000, null, 'rep'
  ),
  (
    'a_pos_cooler_cling', 'Cooler Door Clings (Print-Ready)',
    'Static cling artwork sized for standard reach-in doors.',
    'pos', '#demo-asset', 'ZIP', 22400000, null, 'rep'
  ),
  (
    'a_pos_shelf_talkers', 'Shelf Talkers — Full Line',
    'Print-and-clip shelf talkers for every flavor.',
    'pos', '#demo-asset', 'PDF', 6100000, null, 'rep'
  ),
  (
    'a_logo_pack', 'Brand Logo Pack',
    'Primary, stacked, and mono logos in SVG + PNG.',
    'logo', '#demo-asset', 'ZIP', 3300000, null, 'rep'
  ),
  (
    'a_marg_sell', 'Margarita Mix Sell Sheet',
    'Classic Lime + Spicy Mango with serve suggestions.',
    'sell_sheet', '#demo-asset', 'PDF', 1330000, 'margarita-mix-classic-lime', 'rep'
  )
on conflict (id) do nothing;
