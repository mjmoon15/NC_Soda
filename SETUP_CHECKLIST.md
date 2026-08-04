# Going Live — Setup Checklist

The app runs **immediately in demo mode** with seed data — no setup needed to
explore it. Follow this checklist only when you're ready to connect a real
Supabase backend. When it's done, the orange "Demo Mode" banner disappears and
the app reads/writes live data.

You'll need about 15 minutes. No coding required.

---

### 1. Create a Supabase project

1. Go to **https://supabase.com** → **Sign in** → **New project**.
2. Pick your organization, give it a name (e.g. `new-creation-soda`), and set a
   strong **database password** (save it somewhere safe).
3. Choose a region close to you → **Create new project**. Wait ~2 minutes for it
   to finish provisioning.

### 2. Copy your keys into `.env.local`

1. In the project dashboard, click **⚙ Project Settings** (bottom-left) → **API**.
2. Copy these three values:
   - **Project URL**
   - **anon / public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" — click "Reveal"; keep secret)
3. In the project folder, make a copy of `.env.example` named **`.env.local`** and
   fill in the values (variable names must match exactly):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   > `.env.local` is gitignored — never commit your keys. The service-role key is
   > server-only; never put it in a `NEXT_PUBLIC_` variable.

### 3. Run the 3 migrations (in order)

1. In the dashboard, click **SQL Editor** (left sidebar) → **+ New query**.
2. Run these three files **one at a time, in this exact order**. For each: open
   the file from `supabase/migrations/`, copy its full contents into the editor,
   then click **Run**.
   1. `supabase/migrations/0001_schema.sql` — tables + the public catalog view
   2. `supabase/migrations/0002_rls.sql` — security rules + new-user trigger
   3. `supabase/migrations/0003_seed.sql` — the products, videos, and assets
3. Each run should report success with no errors before moving to the next.

### 4. Create the two storage buckets

1. Click **Storage** (left sidebar) → **New bucket**.
2. Create a bucket named **`assets`** — leave **"Public bucket" OFF** (private).
3. Create another named **`training`** — also **"Public bucket" OFF** (private).
4. (Optional now, can do later) Upload your real sell sheets / POS to `assets`
   and training videos to `training`. See **`supabase/storage.md`** for the exact
   file paths the seed expects.

### 5. Create an admin user and set their role

1. Click **Authentication** (left sidebar) → **Users** → **Add user** →
   **Create new user**. Enter your email + a password → **Create user**.
   (The new-user trigger automatically gives them a `profiles` row with role `rep`.)
2. Promote yourself to **admin**: go to **SQL Editor** → **+ New query**, paste
   the line below with your email, and **Run**:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```

   > Everyone signs up as a `rep` by default. Repeat step 5.2 for any teammate
   > who should be an admin. Leave reps as-is.

### 6. Restart the dev server

1. Stop the running app (`Ctrl-C` in the terminal) and start it again:

   ```bash
   npm run dev
   ```

2. Open **http://localhost:3000**. The **"Demo Mode" banner is gone** — you're
   live. Sign in at `/login` with the admin email/password from step 5.

---

**Done.** The app now reads products/videos/assets from Supabase, enforces the
rep/admin tiers via row-level security, and serves gated files through
short-lived signed URLs. New teammates self-serve by signing up (they land as
reps); promote them with the SQL in step 5.2 when needed.
