# New Creation Soda Works

A B2B + brand site for **New Creation Soda Works**, a craft soda label. One app
serves three audiences with progressively gated content:

- **Public** — the storefront: brand story, product catalog (flavor, calories,
  gluten-free), and public brand/product videos. No login.
- **Rep** — distributor sales reps: everything public, plus full product specs
  (SKU, UPC, case pack, net weight, shelf life), gated training videos, and
  downloadable sell sheets / POS / logo assets.
- **Admin** — the brand team: everything reps see, plus management of products,
  videos, and assets.

The role tiers are enforced server-side. In production, Supabase **row-level
security** (see `supabase/migrations/0002_rls.sql`) guarantees the public never
receives SKU/UPC/case data — the storefront reads a restricted `public_products`
view, while reps and admins read the full tables.

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. The app runs **immediately with seed data** — no
database or keys required. An orange "Demo Mode" banner shows while it's
unconfigured. Everything is explorable, including the gated surfaces, via the
demo personas below.

### Demo personas

On the **`/login`** page (demo mode) there are one-click sign-in buttons:

- **Rep** — _Riley Rep_, Coastal Beverage Distributors. Unlocks product specs,
  training videos, and the asset library.
- **Admin** — _Avery Admin_, New Creation Soda Works. Unlocks everything reps see
  plus the admin management views.

These are cookie-based stand-ins (no real accounts) so you can preview every tier
without setting up a backend.

## Running tests

```bash
npm test          # run the Vitest suite once
npm run test:watch
```

Other scripts: `npm run typecheck` (tsc), `npm run build`, `npm run lint`.

## Going live (connect Supabase)

To switch from demo data to a real backend, follow **`SETUP_CHECKLIST.md`** — a
numbered, non-technical walkthrough: create a Supabase project, drop your keys
into `.env.local`, run the three SQL migrations, create the storage buckets, and
make yourself an admin. When configured, the demo banner disappears and the app
reads/writes live data. Storage details (private buckets + server-minted signed
URLs) are in `supabase/storage.md`.

## Stack

- **Next.js** (App Router, React 19, TypeScript) — Server Components by default.
- **Supabase** — Postgres + Auth + Storage, with row-level security for the tiers.
- **Plain CSS** — design tokens and component styles, no Tailwind.
- **Vitest** — test runner.

The app is built to run with **no Supabase attached** (demo/seed mode) and to
light up against a real project the moment the env vars are present — every data
read goes through `lib/data/` which auto-falls-back to seed data when unconfigured.
