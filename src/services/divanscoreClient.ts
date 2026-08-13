import { getEnv } from "../config/env.js";
import { ErrorResponse } from "../utils/errorResponse.js";

/**
 * Thin HTTP client for the divanscore RapidAPI host, used for standings and
 * top scorers. Mirrors footballDataClient so error handling stays uniform.
 */
export const divanscoreClient = {
  async get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
    const env = getEnv();
    const url = new URL(path, env.DIVANSCORE_BASE_URL);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    let res: Response;

    try {
      res = await fetch(url, {
        headers: {
          "x-rapidapi-key": env.RAPIDAPI_KEY,
          "x-rapidapi-host": new URL(env.DIVANSCORE_BASE_URL).host,
          Accept: "application/json",
        },
      });
    } catch {
      throw new ErrorResponse("Could not reach the divanscore API", 502);
    }

    if (!res.ok) {
      const status = res.status >= 500 ? 502 : res.status;
      throw new ErrorResponse(
        `divanscore request failed with status ${res.status}`,
        status
      );
    }

    return (await res.json()) as T;
  },
};
