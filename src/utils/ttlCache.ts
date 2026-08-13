import { getEnv } from "../config/env.js";

interface Entry<T> {
  expiresAt: number;
  value: Promise<T>;
}

/**
 * Memoises async upstream calls for a TTL so repeated page loads do not burn
 * through the third-party API rate limits. Rejected promises are evicted so a
 * transient failure is not cached.
 */
export function createTtlCache<T>(ttlMs?: number) {
  const entries = new Map<string, Entry<T>>();

  return {
    get(key: string, factory: () => Promise<T>): Promise<T> {
      const ttl = ttlMs ?? getEnv().CACHE_TTL_MS;
      const existing = entries.get(key);

      if (existing && existing.expiresAt > Date.now()) {
        return existing.value;
      }

      const value = factory();
      entries.set(key, { expiresAt: Date.now() + ttl, value });
      value.catch(() => entries.delete(key));

      return value;
    },

    clear(): void {
      entries.clear();
    },
  };
}
