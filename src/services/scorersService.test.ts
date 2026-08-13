import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scorersService } from "./scorersService.js";
import { divanscoreClient } from "./divanscoreClient.js";
import { loadEnv, resetEnvCache } from "../config/env.js";

vi.mock("./divanscoreClient.js", () => ({
  divanscoreClient: { get: vi.fn() },
}));

const goals = [
  {
    player: { name: "Haaland" },
    team: { id: 1, name: "Norway" },
    statistics: { goals: 7 },
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  scorersService.clearCache();
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

describe("scorersService.getTopScorers", () => {
  it("unwraps topPlayers.goals from the response", async () => {
    vi.mocked(divanscoreClient.get).mockResolvedValue({ topPlayers: { goals } });

    await expect(scorersService.getTopScorers()).resolves.toEqual(goals);
    expect(divanscoreClient.get).toHaveBeenCalledWith("/tournaments/get-top-players", {
      tournamentId: "16",
      seasonId: "58210",
    });
  });

  it("serves the cached result on a second call", async () => {
    vi.mocked(divanscoreClient.get).mockResolvedValue({ topPlayers: { goals } });

    await scorersService.getTopScorers();
    await scorersService.getTopScorers();

    expect(divanscoreClient.get).toHaveBeenCalledTimes(1);
  });

  it("propagates upstream failures", async () => {
    vi.mocked(divanscoreClient.get).mockRejectedValue(new Error("forbidden"));

    await expect(scorersService.getTopScorers()).rejects.toThrow("forbidden");
  });
});
