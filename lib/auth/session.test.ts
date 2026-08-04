import { describe, expect, it } from "vitest";
import { hasAccess } from "./session";
import type { SessionUser } from "@/lib/types";

const user = (role: SessionUser["role"]): SessionUser => ({
  email: "x@y.z",
  fullName: "Test",
  role,
  isDemo: true,
});

describe("hasAccess", () => {
  it("denies anonymous viewers", () => {
    expect(hasAccess(null, "rep")).toBe(false);
    expect(hasAccess(null, "admin")).toBe(false);
  });

  it("lets reps into rep content but not admin", () => {
    expect(hasAccess(user("rep"), "rep")).toBe(true);
    expect(hasAccess(user("rep"), "admin")).toBe(false);
  });

  it("lets admins into both rep and admin content", () => {
    expect(hasAccess(user("admin"), "rep")).toBe(true);
    expect(hasAccess(user("admin"), "admin")).toBe(true);
  });

  it("treats the public role as no access", () => {
    expect(hasAccess(user("public"), "rep")).toBe(false);
  });
});
