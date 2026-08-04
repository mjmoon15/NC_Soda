# Supabase Storage — buckets & signed URLs

New Creation stores two kinds of gated files in Supabase Storage. Both buckets
are **private** — files are never public. The app reads them by minting
short-lived **signed URLs on the server** using the service-role key, so a URL
is only ever handed to a rep or admin who passed the app's auth check.

## 1. Buckets to create

In the Supabase dashboard → **Storage** → **New bucket**, create both:

| Bucket name | Public? | What goes in it |
|-------------|---------|-----------------|
| `assets`    | **Private** (leave "Public bucket" OFF) | Sell sheets, POS art, spec sheets, logo packs (PDF / PNG / ZIP). |
| `training`  | **Private** (leave "Public bucket" OFF) | Gated training videos (MP4). |

> Bucket names must be exactly `assets` and `training` — the seed `storage_path`
> values (e.g. `training/cooler-set-walkthrough.mp4`) and the asset upload paths
> assume them.

## 2. Uploading files

Dashboard → **Storage** → open the bucket → **Upload file**.

- **Training videos** go in `training/` with the filename used in the seed:
  - `training/cooler-set-walkthrough.mp4`
  - `training/buyer-pitch.mp4`
  - `training/margins-and-case-math.mp4`
  These match `videos.storage_path` from `0003_seed.sql`. If you upload under a
  different name, update that row's `storage_path` to match.
- **Assets** (sell sheets, POS, logos) go in the `assets` bucket. After
  uploading, set the matching `assets.file_url` row to the object's storage path
  (e.g. `assets/parakey-sell-sheet.pdf`). The seed ships `#demo-asset` as a
  placeholder; replace it with the real path so the server can sign it.

(You can also upload programmatically with the service-role client via
`supabase.storage.from('training').upload(path, file)`.)

## 3. How the app serves them (signed URLs)

The browser never gets a permanent link. On the server, `createServiceSupabase()`
(`lib/supabase/server.ts`) uses the **service-role key** to bypass RLS and mint a
time-limited signed URL only after `hasAccess(user, 'rep')` passes:

```ts
const supabase = await createServiceSupabase();
const { data } = await supabase
  .storage
  .from("training")                       // or "assets"
  .createSignedUrl(video.storagePath, 60 * 60); // 1-hour link
// data.signedUrl -> hand to <video src> / download link
```

Because the buckets are private and signing happens server-side behind the auth
check, an unauthenticated visitor can never reach a gated file even if they guess
the path. **Never expose the service-role key to the browser.**
