import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { matchService } from "./matchService.js";
import { footballDataClient } from "./footballDataClient.js";
import { loadEnv, resetEnvCache } from "../config/env.js";
import { GROUP_LETTERS } from "../models/worldcup.js";

vi.mock("./footballDataClient.js", () => ({
  footballDataClient: { get: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
  matchService.clearCache();
  loadEnv({
    API_KEY: "a",
    RAPIDAPI_KEY: "b",
    COMPETITION_ID: "2000",
    SEASON: "2026",
  } as NodeJS.ProcessEnv);
});

afterEach(() => {
  resetEnvCache();
});

describe("matchService.getGroupMatches", () => {
  it("requests every group for the configured competition and season", async () => {
    vi.mocked(footballDataClient.get).mockResolvedValue({ count: 0, matches: [] });

    await matchService.getGroupMatches();

    expect(footballDataClient.get).toHaveBeenCalledTimes(GROUP_LETTERS.length);
    expect(footballDataClient.get).toHaveBeenCalledWith(
      "/competitions/2000/matches?season=2026&group=GROUP_A"
    );
    expect(footballDataClient.get).toHaveBeenCalledWith(
      "/competitions/2000/matches?season=2026&group=GROUP_L"
    );
  });

  it("keys each response by its group letter", async () => {
    vi.mocked(footballDataClient.get).mockImplementation(async (path: string) => ({
      count: 1,
      matches: [{ id: path.length }],
    }));

    const result = await matchService.getGroupMatches();

    expect(Object.keys(result)).toEqual([...GROUP_LETTERS]);
    expect(result.A.count).toBe(1);
  });

  it("serves the cached result on a second call", async () => {
    vi.mocked(footballDataClient.get).mockResolvedValue({ count: 0, matches: [] });

    await matchService.getGroupMatches();
    await matchService.getGroupMatches();

    expect(footballDataClient.get).toHaveBeenCalledTimes(GROUP_LETTERS.length);
  });

  it("propagates upstream failures", async () => {
    vi.mocked(footballDataClient.get).mockRejectedValue(new Error("rate limited"));

    await expect(matchService.getGroupMatches()).rejects.toThrow("rate limited");
  });
});
