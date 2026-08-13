import { describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getPlayoff } from "./playoff.js";

describe("playoff controller", () => {
  it("renders the static bracket view", () => {
    const res = { render: vi.fn() } as unknown as Response;

    getPlayoff({} as Request, res);

    expect(res.render).toHaveBeenCalledWith("playoff");
  });
});
