import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getScorers } from "./scorers.js";
import { scorersService } from "../services/scorersService.js";

vi.mock("../services/scorersService.js", () => ({
  scorersService: { getTopScorers: vi.fn(), clearCache: vi.fn() },
}));

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

describe("scorers controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the scorers view with the goal scorers", async () => {
    const result = [{ player: { name: "Mbappe" } }];
    vi.mocked(scorersService.getTopScorers).mockResolvedValue(result as never);
    const res = mockRes();

    await getScorers({} as Request, res, vi.fn());

    expect(res.render).toHaveBeenCalledWith("scorers", { result });
  });

  it("forwards service errors to next", async () => {
    const error = new Error("upstream down");
    vi.mocked(scorersService.getTopScorers).mockRejectedValue(error);
    const next = vi.fn();

    await getScorers({} as Request, mockRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
