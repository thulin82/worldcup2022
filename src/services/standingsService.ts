import { divanscoreClient } from "./divanscoreClient.js";
import { getEnv } from "../config/env.js";
import { createTtlCache } from "../utils/ttlCache.js";
import type { StandingsGroup, StandingsResponse } from "../models/worldcup.js";

const cache = createTtlCache<StandingsGroup[]>();

export const standingsService = {
  getStandings(): Promise<StandingsGroup[]> {
    const env = getEnv();

    return cache.get(`standings:${env.TOURNAMENT_ID}:${env.SEASON_ID}`, async () => {
      const data = await divanscoreClient.get<StandingsResponse>(
        "/tournaments/get-standings",
        { tournamentId: env.TOURNAMENT_ID, seasonId: env.SEASON_ID }
      );

      return data.standings;
    });
  },

  clearCache(): void {
    cache.clear();
  },
};
