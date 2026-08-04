import { describe, expect, it } from "vitest";
import { cx, formatBytes, formatDuration } from "./utils";

describe("cx", () => {
  it("joins truthy class names", () => {
    expect(cx("a", "b", "c")).toBe("a b c");
  });
  it("drops falsy values", () => {
    expect(cx("a", false, null, undefined, "", "b")).toBe("a b");
  });
  it("returns empty string when nothing truthy", () => {
    expect(cx(false, null, undefined)).toBe("");
  });
});

describe("formatBytes", () => {
  it("handles zero", () => {
    expect(formatBytes(0)).toBe("0 B");
  });
  it("formats bytes without decimals", () => {
    expect(formatBytes(512)).toBe("512 B");
  });
  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 KB");
  });
  it("formats megabytes", () => {
    expect(formatBytes(1_500_000)).toBe("1.4 MB");
  });
});

describe("formatDuration", () => {
  it("formats sub-minute", () => {
    expect(formatDuration(31)).toBe("0:31");
  });
  it("pads seconds", () => {
    expect(formatDuration(95)).toBe("1:35");
  });
  it("handles multi-minute", () => {
    expect(formatDuration(412)).toBe("6:52");
  });
});
