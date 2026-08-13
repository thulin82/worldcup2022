import { footballDataClient } from "./footballDataClient.js";
import { getEnv } from "../config/env.js";
import { createTtlCache } from "../utils/ttlCache.js";
import {
  GROUP_LETTERS,
  type GroupMatches,
  type MatchesResponse,
} from "../models/worldcup.js";

const cache = createTtlCache<GroupMatches>();

/**
 * Group stage fixtures. The upstream API only filters one group per request,
 * so all 12 are fetched in parallel and cached together.
 */
export const matchService = {
  getGroupMatches(): Promise<GroupMatches> {
    const env = getEnv();

    return cache.get(`groups:${env.COMPETITION_ID}:${env.SEASON}`, async () => {
      const responses = await Promise.all(
        GROUP_LETTERS.map((group) =>
          footballDataClient.get<MatchesResponse>(
            `/competitions/${env.COMPETITION_ID}/matches?season=${env.SEASON}&group=GROUP_${group}`
          )
        )
      );

      return Object.fromEntries(
        GROUP_LETTERS.map((group, index) => [group, responses[index]])
      ) as GroupMatches;
    });
  },

  clearCache(): void {
    cache.clear();
  },
};
