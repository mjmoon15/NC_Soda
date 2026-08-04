import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "@/lib/config";

/**
 * Server Supabase client bound to the request cookies (RLS-aware: queries run
 * as the signed-in user). Only call when `isSupabaseConfigured` is true.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options?: Record<string, unknown>;
        }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        } catch {
          // Called from a Server Component — middleware refreshes the session.
        }
      },
    },
  });
}

/**
 * Service-role client that BYPASSES RLS. Server-only. Use for admin writes and
 * minting signed URLs for gated storage objects. Never import into client code.
 *
 * Deliberately a plain, stateless client (createClient, not @supabase/ssr's
 * createServerClient) — it must NOT read request cookies. Wiring it to
 * cookies caused it to authenticate as the signed-in user's own session
 * instead of the service role, silently losing the RLS bypass and making
 * private Storage objects 404 as if they didn't exist.
 */
export async function createServiceSupabase() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
