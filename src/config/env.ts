import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4567),
  API_KEY: z.string().min(1, "API_KEY is required"),
  RAPIDAPI_KEY: z.string().min(1, "RAPIDAPI_KEY is required"),
  FOOTBALL_API_BASE_URL: z.url().default("https://api.football-data.org/v4"),
  DIVANSCORE_BASE_URL: z.url().default("https://divanscore.p.rapidapi.com"),
  COMPETITION_ID: z.coerce.number().default(2000),
  SEASON: z.coerce.number().default(2026),
  TOURNAMENT_ID: z.string().default("16"),
  SEASON_ID: z.string().default("58210"),
  CACHE_TTL_MS: z.coerce.number().default(5 * 60 * 1000),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
  }

  cached = parsed.data;

  return parsed.data;
}

/** Env for modules that are constructed lazily per request instead of at boot. */
export function getEnv(): Env {
  return cached ?? loadEnv();
}

export function resetEnvCache(): void {
  cached = undefined;
}
