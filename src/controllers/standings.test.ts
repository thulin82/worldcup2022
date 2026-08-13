import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getStandings } from "./standings.js";
import { standingsService } from "../services/standingsService.js";

vi.mock("../services/standingsService.js", () => ({
  standingsService: { getStandings: vi.fn(), clearCache: vi.fn() },
}));

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

describe("standings controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the standings view with the groups", async () => {
    const result = [{ name: "Group A", rows: [] }];
    vi.mocked(standingsService.getStandings).mockResolvedValue(result as never);
    const res = mockRes();

    await getStandings({} as Request, res, vi.fn());

    expect(res.render).toHaveBeenCalledWith("standings", { result });
  });

  it("forwards service errors to next", async () => {
    const error = new Error("upstream down");
    vi.mocked(standingsService.getStandings).mockRejectedValue(error);
    const next = vi.fn();

    await getStandings({} as Request, mockRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
