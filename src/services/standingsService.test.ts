import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { standingsService } from "./standingsService.js";
import { divanscoreClient } from "./divanscoreClient.js";
import { loadEnv, resetEnvCache } from "../config/env.js";

vi.mock("./divanscoreClient.js", () => ({
  divanscoreClient: { get: vi.fn() },
}));

const standings = [{ name: "Group A", rows: [] }];

beforeEach(() => {
  vi.clearAllMocks();
  standingsService.clearCache();
  loadEnv({
    API_KEY: "a",
    RAPIDAPI_KEY: "b",
    TOURNAMENT_ID: "16",
    SEASON_ID: "58210",
  } as NodeJS.ProcessEnv);
});

afterEach(() => {
  resetEnvCache();
});

describe("standingsService.getStandings", () => {
  it("unwraps the standings array from the response", async () => {
    vi.mocked(divanscoreClient.get).mockResolvedValue({ standings });

    await expect(standingsService.getStandings()).resolves.toEqual(standings);
    expect(divanscoreClient.get).toHaveBeenCalledWith("/tournaments/get-standings", {
      tournamentId: "16",
      seasonId: "58210",
    });
  });

  it("serves the cached result on a second call", async () => {
    vi.mocked(divanscoreClient.get).mockResolvedValue({ standings });

    await standingsService.getStandings();
    await standingsService.getStandings();

    expect(divanscoreClient.get).toHaveBeenCalledTimes(1);
  });

  it("propagates upstream failures", async () => {
    vi.mocked(divanscoreClient.get).mockRejectedValue(new Error("forbidden"));

    await expect(standingsService.getStandings()).rejects.toThrow("forbidden");
  });
});
