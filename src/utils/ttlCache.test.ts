import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTtlCache } from "./ttlCache.js";
import { loadEnv, resetEnvCache } from "../config/env.js";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  resetEnvCache();
});

describe("createTtlCache", () => {
  it("calls the factory once while the entry is fresh", async () => {
    const cache = createTtlCache<string>(1000);
    const factory = vi.fn().mockResolvedValue("value");

    await cache.get("key", factory);
    await cache.get("key", factory);

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("keeps separate entries per key", async () => {
    const cache = createTtlCache<string>(1000);
    const factory = vi.fn().mockResolvedValue("value");

    await cache.get("a", factory);
    await cache.get("b", factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("refetches once the ttl has elapsed", async () => {
    const cache = createTtlCache<string>(1000);
    const factory = vi.fn().mockResolvedValue("value");

    await cache.get("key", factory);
    vi.advanceTimersByTime(1001);
    await cache.get("key", factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("does not cache a failed lookup", async () => {
    const cache = createTtlCache<string>(1000);
    const factory = vi
      .fn()
      .mockRejectedValueOnce(new Error("upstream"))
      .mockResolvedValue("value");

    await expect(cache.get("key", factory)).rejects.toThrow("upstream");

    await expect(cache.get("key", factory)).resolves.toBe("value");
    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("clear() evicts everything", async () => {
    const cache = createTtlCache<string>(1000);
    const factory = vi.fn().mockResolvedValue("value");

    await cache.get("key", factory);
    cache.clear();
    await cache.get("key", factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });

  it("falls back to the configured CACHE_TTL_MS", async () => {
    loadEnv({
      API_KEY: "a",
      RAPIDAPI_KEY: "b",
      CACHE_TTL_MS: "50",
    } as NodeJS.ProcessEnv);
    const cache = createTtlCache<string>();
    const factory = vi.fn().mockResolvedValue("value");

    await cache.get("key", factory);
    vi.advanceTimersByTime(51);
    await cache.get("key", factory);

    expect(factory).toHaveBeenCalledTimes(2);
  });
});
