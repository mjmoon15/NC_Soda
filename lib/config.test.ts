import { describe, expect, it } from "vitest";
import { isDemoMode, isSupabaseConfigured, SITE } from "./config";

describe("config", () => {
  it("defaults to demo mode when Supabase env vars are unset", () => {
    // The test environment has no NEXT_PUBLIC_SUPABASE_* vars.
    expect(isSupabaseConfigured).toBe(false);
    expect(isDemoMode).toBe(true);
  });

  it("exposes site identity", () => {
    expect(SITE.name).toMatch(/New Creation/);
  });
});
