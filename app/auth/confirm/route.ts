import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /auth/confirm?token_hash=...&type=...
 *
 * Landing point for every Supabase auth email (invite, password recovery,
 * magic link). Verifies the token server-side — which sets the session
 * cookies via `@supabase/ssr` — then routes the now-signed-in visitor
 * onward:
 *
 *  - invite / recovery → /set-password (they don't have one yet, or are
 *    resetting it)
 *  - anything else (magic link, etc.) → their role's dashboard
 *
 * On a missing/expired/invalid token, bounces back to /login with a flag
 * the login page can use to show a friendly message.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      if (type === "invite" || type === "recovery") {
        return NextResponse.redirect(`${origin}/set-password`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id ?? "")
        .single();

      return NextResponse.redirect(
        `${origin}${profile?.role === "admin" ? "/admin" : "/rep"}`
      );
    }
  }

  return NextResponse.redirect(`${origin}/login?error=invalid-link`);
}
