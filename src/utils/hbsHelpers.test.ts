import { describe, expect, it, vi } from "vitest";
import { isPlayOffs, limit, registerHelpers } from "./hbsHelpers.js";

describe("isPlayOffs", () => {
  it("is true only for the exact Playoffs marker", () => {
    expect(isPlayOffs("Playoffs")).toBe(true);
    expect(isPlayOffs("Eliminated")).toBe(false);
    expect(isPlayOffs(undefined)).toBe(false);
  });
});

describe("limit", () => {
  it("truncates an array to the requested length", () => {
    expect(limit([1, 2, 3, 4], 2)).toEqual([1, 2]);
  });

  it("returns the whole array when it is shorter than the limit", () => {
    expect(limit([1, 2], 10)).toEqual([1, 2]);
  });

  it("returns an empty array for non-array input", () => {
    expect(limit(undefined, 5)).toEqual([]);
  });
});

describe("registerHelpers", () => {
  it("registers both helpers on the engine", () => {
    const engine = { registerHelper: vi.fn() };

    registerHelpers(engine as never);

    expect(engine.registerHelper).toHaveBeenCalledWith("isPlayOffs", isPlayOffs);
    expect(engine.registerHelper).toHaveBeenCalledWith("limit", limit);
  });
});
