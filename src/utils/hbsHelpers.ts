import type hbs from "hbs";

/** True when a standings row's promotion text marks the team as through. */
export function isPlayOffs(value: unknown): boolean {
  return value === "Playoffs";
}

/** Returns the first `count` items of an array, or [] for anything else. */
export function limit<T>(value: T[] | unknown, count: number): T[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, count);
}

export function registerHelpers(engine: typeof hbs): void {
  engine.registerHelper("isPlayOffs", isPlayOffs);
  engine.registerHelper("limit", limit);
}
