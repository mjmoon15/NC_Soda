import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/config";
import { demoProfiles } from "@/lib/data/mock";
import type { SessionUser, UserRole } from "@/lib/types";

export const DEMO_COOKIE = "nc_demo_role";

/**
 * Resolve the current viewer.
 * - Demo mode: reads the `nc_demo_role` cookie set by the demo login.
 * - Real mode: reads the Supabase session + the user's `profiles.role`.
 * Returns null when nobody is signed in (public visitor).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured) {
    const cookieStore = await cookies();
    const role = cookieStore.get(DEMO_COOKIE)?.value as
      | "rep"
      | "admin"
      | undefined;
    if (role !== "rep" && role !== "admin") return null;
    const p = demoProfiles[role];
    return {
      email: p.email,
      fullName: p.fullName,
      role: p.role,
      company: p.company,
      isDemo: true,
    };
  }

  // Real Supabase path
  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, company")
    .eq("id", user.id)
    .single();

  return {
    email: user.email ?? "",
    fullName: profile?.full_name ?? user.email ?? "Member",
    role: (profile?.role as UserRole) ?? "rep",
    company: profile?.company ?? undefined,
    isDemo: false,
  };
}

/** Does the viewer meet the minimum role? admin satisfies rep-gated content. */
export function hasAccess(
  user: SessionUser | null,
  required: Exclude<UserRole, "public">
): boolean {
  if (!user) return false;
  if (required === "rep") return user.role === "rep" || user.role === "admin";
  return user.role === "admin";
}
