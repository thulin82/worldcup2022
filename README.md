# [WORLD CUP 2026](https://github.com/thulin82/worldcup2022)

[![GitHub Actions](https://github.com/thulin82/worldcup2022/actions/workflows/ci.yml/badge.svg)](https://github.com/thulin82/worldcup2022/actions/workflows/ci.yml)

Server-rendered World Cup group fixtures, standings and top scorers. TypeScript,
Express 5 and Handlebars.

## Setup

```
$ git clone git@github.com:thulin82/worldcup2022.git
$ npm install
$ cp config/config.env.example config/config.env   # then fill in the API keys
$ npm run dev
```

### Environment variables

`config/config.env` is gitignored. See `config/config.env.example` for the full
list; only these two are required:

| Variable       | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `API_KEY`      | [football-data.org](https://www.football-data.org/client/register) API token |
| `RAPIDAPI_KEY` | [RapidAPI](https://rapidapi.com/) key for the divanscore host                |

The environment is validated with zod at startup, so a missing or malformed
value fails fast instead of surfacing as a runtime error.

## Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Watch mode via `tsx`                    |
| `npm run build`      | Compile to `dist/`                      |
| `npm start`          | Run the compiled build                  |
| `npm test`           | Run the Vitest suite once               |
| `npm run test:watch` | Vitest in watch mode                    |
| `npm run test:ci`    | Vitest with coverage and a JUnit report |
| `npm run typecheck`  | `tsc --noEmit`                          |
| `npm run lint`       | ESLint                                  |
| `npm run format`     | Prettier                                |

## Structure

Layer-based, with tests colocated next to the code they cover as `*.test.ts`.

```
src/
  app.ts               Express app factory (no port binding, so tests can import it)
  server.ts            Loads env and listens
  config/env.ts        zod-validated environment
  models/              Upstream API response types
  services/            HTTP clients + business logic, cached with a TTL
  controllers/         Thin request handlers that render views
  routes/              Route table
  middleware/          asyncHandler and the error page renderer
  utils/               ErrorResponse, TTL cache, Handlebars helpers
views/                 Handlebars templates (not compiled into dist)
public/                Static assets
```

## Routes

| Route        | Description                      |
| ------------ | -------------------------------- |
| `/`          | Group stage fixtures, groups A–L |
| `/standings` | Group standings tables           |
| `/scorers`   | Top 10 goal scorers              |
| `/playoff`   | Knockout stage bracket           |
| `/healthz`   | Liveness probe                   |

© Markus Thulin 2022-
