import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { footballDataClient } from "./footballDataClient.js";
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
    RAPIDAPI_KEY: "rapid",
    FOOTBALL_API_BASE_URL: "https://api.example.org/v4",
  } as NodeJS.ProcessEnv);
});

afterEach(() => {
  resetEnvCache();
  vi.unstubAllGlobals();
});

describe("footballDataClient.get", () => {
  it("calls the configured base url with auth headers", async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ count: 0 }) });

    const result = await footballDataClient.get<{ count: number }>("/matches");

    expect(fetchMock).toHaveBeenCalledWith("https://api.example.org/v4/matches", {
      headers: { "X-Auth-Token": "test-key", Accept: "application/json" },
    });
    expect(result).toEqual({ count: 0 });
  });

  it("maps a client error to the same status code", async () => {
    mockFetch({ ok: false, status: 429 });

    await expect(footballDataClient.get("/matches")).rejects.toMatchObject({
      statusCode: 429,
    });
  });

  it("maps an upstream server error to 502", async () => {
    mockFetch({ ok: false, status: 503 });

    await expect(footballDataClient.get("/matches")).rejects.toMatchObject({
      statusCode: 502,
    });
  });

  it("maps a network failure to 502", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));

    const error = await footballDataClient.get("/matches").catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ErrorResponse);
    expect((error as ErrorResponse).statusCode).toBe(502);
  });
});
