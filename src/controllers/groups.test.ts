import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getGroups } from "./groups.js";
import { matchService } from "../services/matchService.js";

vi.mock("../services/matchService.js", () => ({
  matchService: { getGroupMatches: vi.fn(), clearCache: vi.fn() },
}));

function mockRes() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.render = vi.fn().mockReturnValue(res);
  return res;
}

describe("groups controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the index view with the group letters as top-level keys", async () => {
    const groups = { A: { count: 0, matches: [] } };
    vi.mocked(matchService.getGroupMatches).mockResolvedValue(groups as never);
    const res = mockRes();

    await getGroups({} as Request, res, vi.fn());

    expect(res.render).toHaveBeenCalledWith("index", groups);
  });

  it("forwards service errors to next", async () => {
    const error = new Error("upstream down");
    vi.mocked(matchService.getGroupMatches).mockRejectedValue(error);
    const next = vi.fn();

    await getGroups({} as Request, mockRes(), next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
