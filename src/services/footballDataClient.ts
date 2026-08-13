import { getEnv } from "../config/env.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * Thin HTTP client for football-data.org: adds auth headers and maps
 * upstream failures onto ErrorResponse so the error middleware can render them.
 */
export const footballDataClient = {
  async get<T>(path: string): Promise<T> {
    const env = getEnv();
    const url = `${env.FOOTBALL_API_BASE_URL}${path}`;

    let res: Response;

    try {
      res = await fetch(url, {
        headers: {
          "X-Auth-Token": env.API_KEY,
          Accept: "application/json",
        },
      });
    } catch {
      throw new ErrorResponse("Could not reach the football-data.org API", 502);
    }

    if (!res.ok) {
      const status = res.status >= 500 ? 502 : res.status;
      throw new ErrorResponse(
        `football-data.org request failed with status ${res.status}`,
        status
      );
    }

    return (await res.json()) as T;
  },
};
