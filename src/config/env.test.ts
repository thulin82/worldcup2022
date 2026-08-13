import { afterEach, describe, expect, it } from "vitest";
import { loadEnv, getEnv, resetEnvCache } from "./env.js";

const required = { API_KEY: "secret", RAPIDAPI_KEY: "rapid" } as NodeJS.ProcessEnv;

afterEach(() => {
  resetEnvCache();
});

describe("loadEnv", () => {
  it("applies defaults when only the required values are set", () => {
    const env = loadEnv({ ...required });

    expect(env).toEqual({
      NODE_ENV: "development",
      PORT: 4567,
      API_KEY: "secret",
      RAPIDAPI_KEY: "rapid",
      FOOTBALL_API_BASE_URL: "https://api.football-data.org/v4",
      DIVANSCORE_BASE_URL: "https://divanscore.p.rapidapi.com",
      COMPETITION_ID: 2000,
      SEASON: 2026,
      TOURNAMENT_ID: "16",
      SEASON_ID: "58210",
      CACHE_TTL_MS: 300000,
    });
  });

  it("coerces numeric values", () => {
    const env = loadEnv({ ...required, PORT: "8080", SEASON: "2030" });

    expect(env.PORT).toBe(8080);
    expect(env.SEASON).toBe(2030);
  });

  it("throws when API_KEY is missing", () => {
    expect(() => loadEnv({ RAPIDAPI_KEY: "rapid" } as NodeJS.ProcessEnv)).toThrow(
      /Invalid environment configuration/
    );
  });

  it("throws when RAPIDAPI_KEY is missing", () => {
    expect(() => loadEnv({ API_KEY: "secret" } as NodeJS.ProcessEnv)).toThrow(
      /Invalid environment configuration/
    );
  });

  it("throws when NODE_ENV is not a known value", () => {
    expect(() => loadEnv({ ...required, NODE_ENV: "staging" })).toThrow(
      /Invalid environment configuration/
    );
  });

  it("throws when an API base url is not a url", () => {
    expect(() => loadEnv({ ...required, FOOTBALL_API_BASE_URL: "nope" })).toThrow(
      /Invalid environment configuration/
    );
  });
});

describe("getEnv", () => {
  it("returns the most recently loaded env without re-reading process.env", () => {
    loadEnv({ ...required, API_KEY: "cached-key" });

    expect(getEnv().API_KEY).toBe("cached-key");
  });
});
