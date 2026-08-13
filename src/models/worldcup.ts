/** Shapes returned by the upstream APIs, limited to the fields the views use. */

export interface TeamRef {
  id: number;
  name: string;
}

export interface Score {
  fullTime: { home: number | null; away: number | null };
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  group: string | null;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  score: Score;
}

/** football-data.org /competitions/{id}/matches */
export interface MatchesResponse {
  count: number;
  matches: Match[];
}

/** The 12 World Cup group letters, in display order. */
export const GROUP_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

export type GroupLetter = (typeof GROUP_LETTERS)[number];

/** Group letter -> that group's matches, as consumed by views/index.hbs. */
export type GroupMatches = Record<GroupLetter, MatchesResponse>;

export interface StandingsRow {
  team: TeamRef;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  scoresFor: number;
  scoresAgainst: number;
  points: number;
  promotion?: { text: string };
}

export interface StandingsGroup {
  name: string;
  rows: StandingsRow[];
}

/** divanscore /tournaments/get-standings */
export interface StandingsResponse {
  standings: StandingsGroup[];
}

export interface TopScorer {
  player: { name: string };
  team: TeamRef;
  statistics: { goals: number };
}

/** divanscore /tournaments/get-top-players */
export interface TopPlayersResponse {
  topPlayers: { goals: TopScorer[] };
}
