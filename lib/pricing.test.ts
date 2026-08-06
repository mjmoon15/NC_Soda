import { describe, expect, it } from "vitest";
import { computeCostMetrics, formatCost, parseUnitVolumeToOz } from "./pricing";

describe("parseUnitVolumeToOz", () => {
  it("parses plain fl oz", () => {
    expect(parseUnitVolumeToOz("12 fl oz")).toBe(12);
  });

  it("parses fraction gallons", () => {
    expect(parseUnitVolumeToOz("1/2 gal")).toBe(64);
  });

  it("parses whole/decimal gallons", () => {
    expect(parseUnitVolumeToOz("1 gal")).toBe(128);
    expect(parseUnitVolumeToOz("0.5 gal")).toBe(64);
  });

  it("returns null for unrecognized formats", () => {
    expect(parseUnitVolumeToOz("a lot")).toBeNull();
    expect(parseUnitVolumeToOz("")).toBeNull();
  });
});

describe("computeCostMetrics", () => {
  it("derives cost/unit and cost/oz from case cost", () => {
    const m = computeCostMetrics({
      caseCost: 20.4,
      casePack: 24,
      unitVolume: "12 fl oz",
    });
    expect(m.costPerCase).toBe(20.4);
    expect(m.costPerUnit).toBeCloseTo(0.85, 5);
    expect(m.costPerOz).toBeCloseTo(0.070833, 5);
  });

  it("handles the 1/2 gal margarita mix case pack", () => {
    const m = computeCostMetrics({
      caseCost: 75.15,
      casePack: 9,
      unitVolume: "1/2 gal",
    });
    expect(m.costPerUnit).toBeCloseTo(8.35, 5);
    expect(m.costPerOz).toBeCloseTo(0.130469, 5);
  });

  it("returns nulls when case cost is not set", () => {
    const m = computeCostMetrics({
      caseCost: null,
      casePack: 24,
      unitVolume: "12 fl oz",
    });
    expect(m).toEqual({ costPerCase: null, costPerUnit: null, costPerOz: null });
  });

  it("returns nulls when case pack is missing/zero", () => {
    const m = computeCostMetrics({
      caseCost: 20.4,
      casePack: 0,
      unitVolume: "12 fl oz",
    });
    expect(m.costPerUnit).toBeNull();
    expect(m.costPerOz).toBeNull();
  });

  it("leaves cost/oz null when unit volume can't be parsed", () => {
    const m = computeCostMetrics({
      caseCost: 20.4,
      casePack: 24,
      unitVolume: "mystery size",
    });
    expect(m.costPerUnit).toBeCloseTo(0.85, 5);
    expect(m.costPerOz).toBeNull();
  });
});

describe("formatCost", () => {
  it("formats to 2 decimals by default", () => {
    expect(formatCost(20.4)).toBe("$20.40");
  });

  it("supports extra precision for sub-dollar values", () => {
    expect(formatCost(0.070833, 4)).toBe("$0.0708");
  });

  it("renders an em dash for null", () => {
    expect(formatCost(null)).toBe("—");
  });
});
