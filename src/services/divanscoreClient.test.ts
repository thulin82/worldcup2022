import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { divanscoreClient } from "./divanscoreClient.js";
import { loadEnv, resetEnvCache } from "../config/env.js";
import { ErrorResponse } from "../utils/errorResponse.js";

function mockFetch(response: Partial<Response>) {
  const fetchMock = vi.fn().mockResolvedValue(response as Response);
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  loadEnv({
    API_KEY: "test-key",
    RAPIDAPI_KEY: "rapid-key",
    DIVANSCORE_BASE_URL: "https://scores.example.com",
  } as NodeJS.ProcessEnv);
});

afterEach(() => {
  resetEnvCache();
  vi.unstubAllGlobals();
});

describe("divanscoreClient.get", () => {
  it("builds the url with query params and rapidapi headers", async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ standings: [] }) });

    const result = await divanscoreClient.get("/tournaments/get-standings", {
      tournamentId: "16",
      seasonId: "58210",
    });

    const [url, init] = fetchMock.mock.calls[0];
    expect((url as URL).toString()).toBe(
      "https://scores.example.com/tournaments/get-standings?tournamentId=16&seasonId=58210"
    );
    expect(init).toEqual({
      headers: {
        "x-rapidapi-key": "rapid-key",
        "x-rapidapi-host": "scores.example.com",
        Accept: "application/json",
      },
    });
    expect(result).toEqual({ standings: [] });
  });

  it("maps a client error to the same status code", async () => {
    mockFetch({ ok: false, status: 403 });

    await expect(
      divanscoreClient.get("/tournaments/get-standings")
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("maps an upstream server error to 502", async () => {
    mockFetch({ ok: false, status: 500 });

    await expect(
      divanscoreClient.get("/tournaments/get-standings")
    ).rejects.toMatchObject({ statusCode: 502 });
  });

  it("maps a network failure to 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const error = await divanscoreClient
      .get("/tournaments/get-standings")
      .catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorResponse);
    expect((error as ErrorResponse).statusCode).toBe(502);
  });
});
