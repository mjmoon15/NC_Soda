-- ============================================================================
-- 0002_rls.sql — Row-Level Security, role helpers, and the new-user trigger.
--
-- Access model (three tiers, matching lib/auth/session.ts hasAccess()):
--   public        — anon visitors: catalog via public_products view + public videos
--   rep / admin   — authenticated, gated: full product specs, rep videos, assets
--   admin         — additionally: all profiles + every write
--
-- IMPORTANT VIEW NOTE:
--   public.public_products is a SECURITY DEFINER-style view (security_invoker is
--   OFF, the Postgres default). It therefore runs with its OWNER's privileges and
--   BYPASSES the RLS on the base products table. That is exactly what lets anon
--   read the catalog (public-safe columns only) while the base products table
--   stays locked down to rep+admin. We grant SELECT on the view to anon +
--   authenticated below.
-- ============================================================================

-- ── role helper functions ────────────────────────────────────────────────────
-- SECURITY DEFINER so they can read profiles regardless of the caller's RLS,
-- avoiding recursive policy evaluation when a profiles policy calls is_admin().
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_rep()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('rep', 'admin')
  );
$$;

-- ── enable RLS ────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.videos   enable row level security;
alter table public.assets   enable row level security;

-- ── profiles ──────────────────────────────────────────────────────────────────
-- A user may read/update their own row; admins may read everyone.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ── products (BASE TABLE) ──────────────────────────────────────────────────────
-- SELECT only for rep+admin (anon reads the catalog via public_products view).
-- All writes are admin-only.
drop policy if exists products_select_rep on public.products;
create policy products_select_rep on public.products
  for select to authenticated
  using (public.is_rep());

drop policy if exists products_write_admin on public.products;
create policy products_write_admin on public.products
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── videos ──────────────────────────────────────────────────────────────────────
-- Public videos are readable by everyone (anon + authenticated); rep videos are
-- readable by rep+admin. Writes are admin-only.
drop policy if exists videos_select_public on public.videos;
create policy videos_select_public on public.videos
  for select to anon, authenticated
  using (access = 'public');

drop policy if exists videos_select_rep on public.videos;
create policy videos_select_rep on public.videos
  for select to authenticated
  using (public.is_rep());

drop policy if exists videos_write_admin on public.videos;
create policy videos_write_admin on public.videos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── assets ────────────────────────────────────────────────────────────────────
-- SELECT for rep+admin only. Writes admin-only.
drop policy if exists assets_select_rep on public.assets;
create policy assets_select_rep on public.assets
  for select to authenticated
  using (public.is_rep());

drop policy if exists assets_write_admin on public.assets;
create policy assets_write_admin on public.assets
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── grants ────────────────────────────────────────────────────────────────────
-- Base tables: rely on RLS (above) for row visibility, but the roles still need
-- the table-level privilege. RLS then filters which rows come back.
grant select on public.products to authenticated;
grant select on public.videos   to anon, authenticated;
grant select on public.assets   to authenticated;
grant select, update on public.profiles to authenticated;
grant all on public.products to authenticated;  -- gated again by products_write_admin RLS
grant all on public.videos   to authenticated;  -- gated again by videos_write_admin RLS
grant all on public.assets   to authenticated;  -- gated again by assets_write_admin RLS

-- public_products view: anon + authenticated may SELECT. Because the view is
-- security_invoker OFF, this read bypasses the base products RLS and exposes
-- ONLY the public-safe columns defined in the view (no sku/upc/case data).
grant select on public.public_products to anon, authenticated;

-- ── new-user trigger ──────────────────────────────────────────────────────────
-- Auto-insert a profiles row whenever a new auth.users row is created, defaulting
-- role to 'rep'. Promote a user to admin by updating profiles.role (see checklist).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    'rep'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
