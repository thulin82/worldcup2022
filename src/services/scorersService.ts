import { divanscoreClient } from "./divanscoreClient.js";
import { getEnv } from "../config/env.js";
import { createTtlCache } from "../utils/ttlCache.js";
import type { TopPlayersResponse, TopScorer } from "../models/worldcup.js";

const cache = createTtlCache<TopScorer[]>();

export const scorersService = {
  getTopScorers(): Promise<TopScorer[]> {
    const env = getEnv();

    return cache.get(`scorers:${env.TOURNAMENT_ID}:${env.SEASON_ID}`, async () => {
      const data = await divanscoreClient.get<TopPlayersResponse>(
        "/tournaments/get-top-players",
        { tournamentId: env.TOURNAMENT_ID, seasonId: env.SEASON_ID }
      );

      return data.topPlayers.goals;
    });
  },

  clearCache(): void {
    cache.clear();
  },
};
