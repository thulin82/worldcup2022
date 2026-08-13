import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { matchService } from "./services/matchService.js";
import { standingsService } from "./services/standingsService.js";
import { scorersService } from "./services/scorersService.js";
import {
  GROUP_LETTERS,
  type GroupMatches,
  type MatchesResponse,
} from "./models/worldcup.js";

vi.mock("./services/matchService.js", () => ({
  matchService: { getGroupMatches: vi.fn(), clearCache: vi.fn() },
}));
vi.mock("./services/standingsService.js", () => ({
  standingsService: { getStandings: vi.fn(), clearCache: vi.fn() },
}));
vi.mock("./services/scorersService.js", () => ({
  scorersService: { getTopScorers: vi.fn(), clearCache: vi.fn() },
}));

const app = createApp();

function groupFixture(): GroupMatches {
  const empty: MatchesResponse = { count: 0, matches: [] };
  const groups = Object.fromEntries(
    GROUP_LETTERS.map((group) => [group, empty])
  ) as GroupMatches;

  groups.A = {
    count: 1,
    matches: [
      {
        id: 1,
        utcDate: "2026-06-11T16:00:00Z",
        status: "FINISHED",
        group: "GROUP_A",
        homeTeam: { id: 762, name: "Mexico" },
        awayTeam: { id: 1832, name: "Canada" },
        score: { fullTime: { home: 2, away: 1 } },
      },
    ],
  };

  return groups;
}

describe("app routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("GET /healthz reports ok", async () => {
    const res = await request(app).get("/healthz");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET / renders the group stage fixtures", async () => {
    vi.mocked(matchService.getGroupMatches).mockResolvedValue(groupFixture());

    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
    expect(res.text).toContain("Group A");
    expect(res.text).toContain("Group L");
    expect(res.text).toContain("Mexico");
    expect(res.text).toContain("Canada");
    expect(res.text).toContain("2 - 1");
  });

  it("GET /standings renders the standings tables", async () => {
    vi.mocked(standingsService.getStandings).mockResolvedValue([
      {
        name: "Group A",
        rows: [
          {
            team: { id: 762, name: "Mexico" },
            matches: 3,
            wins: 2,
            draws: 1,
            losses: 0,
            scoresFor: 5,
            scoresAgainst: 1,
            points: 7,
            promotion: { text: "Playoffs" },
          },
        ],
      },
    ]);

    const res = await request(app).get("/standings");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Group A");
    expect(res.text).toContain("Mexico");
    expect(res.text).toMatch(/<td>Q<\/td>/);
  });

  it("GET /scorers renders at most ten scorers", async () => {
    vi.mocked(scorersService.getTopScorers).mockResolvedValue(
      Array.from({ length: 12 }, (_, i) => ({
        player: { name: `Player ${i}` },
        team: { id: i, name: "Sweden" },
        statistics: { goals: 12 - i },
      }))
    );

    const res = await request(app).get("/scorers");

    expect(res.status).toBe(200);
    expect(res.text).toContain("Player 9");
    expect(res.text).not.toContain("Player 10");
  });

  it("GET /playoff renders the static bracket", async () => {
    const res = await request(app).get("/playoff");

    expect(res.status).toBe(200);
    expect(res.type).toBe("text/html");
  });

  it("renders the error page when a service fails", async () => {
    vi.mocked(matchService.getGroupMatches).mockRejectedValue(new Error("upstream"));

    const res = await request(app).get("/");

    expect(res.status).toBe(500);
    expect(res.text).toContain("Something went wrong");
  });

  it("renders the error page with the upstream status for a client error", async () => {
    const { ErrorResponse } = await import("./utils/errorResponse.js");
    vi.mocked(standingsService.getStandings).mockRejectedValue(
      new ErrorResponse("Rate limit reached", 429)
    );

    const res = await request(app).get("/standings");

    expect(res.status).toBe(429);
    expect(res.text).toContain("Rate limit reached");
  });
});
