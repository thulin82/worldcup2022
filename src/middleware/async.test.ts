import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./async.js";

describe("asyncHandler", () => {
  it("resolves without calling next", async () => {
    const next = vi.fn();
    const handler = asyncHandler(async (_req, res) => res.end());
    const res = { end: vi.fn() } as unknown as Response;

    await handler({} as Request, res, next);

    expect(res.end).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a rejected promise to next", async () => {
    const error = new Error("boom");
    const next = vi.fn();
    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler({} as Request, {} as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(error);
  });
});
