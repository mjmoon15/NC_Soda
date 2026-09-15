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

/**
 * REAL MODE: set a password on the CURRENT session. Used right after an
 * invite or password-recovery link has been verified by /auth/confirm — the
 * visitor is already signed in at that point, just without a password yet.
 */
export async function setNewPassword(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error: "Your link has expired. Request a new one and try again.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "admin" ? "/admin" : "/rep");
}

/**
 * REAL MODE: kick off a password-reset email for the given address. Always
 * reports success so we don't leak which emails have accounts.
 */
export async function requestPasswordReset(
  _prev: { error?: string; sent?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; sent?: boolean }> {
  const email = String(formData.get("email") ?? "").trim();

  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }
  if (!email) {
    return { error: "Enter your email address." };
  }

  const { createServerSupabase } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabase();
  await supabase.auth.resetPasswordForEmail(email);

  return { sent: true };
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
