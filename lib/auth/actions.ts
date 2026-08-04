"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { DEMO_COOKIE } from "@/lib/auth/session";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

/** DEMO MODE: sign in as a persona by setting a role cookie, then redirect. */
export async function signInDemo(role: "rep" | "admin") {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, role, COOKIE_OPTS);
  redirect(role === "admin" ? "/admin" : "/rep");
}

/**
 * REAL MODE: email + password sign-in via Supabase. Returns an error string on
 * failure, or redirects on success. Called from the login form action.
 */
export async function signInPassword(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured. Use a demo persona instead." };
  }

  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  // Route by role.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .single();

  redirect(profile?.role === "admin" ? "/admin" : "/rep");
}

/** Sign out of either mode and return to the public site. */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);
  if (isSupabaseConfigured) {
    const { createServerSupabase } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }
  redirect("/");
}
