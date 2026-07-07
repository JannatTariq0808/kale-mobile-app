import type { CardioType } from './cardioPerformance';

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readLevelSource(value: unknown): CardioType | null {
  if (value === 'Running' || value === 'Cycling') return value;
  return null;
}

/** Headline cardio level from a `cardios/{id}` document (live or frozen). */
export function resolveCardioDocLevel(data: Record<string, unknown>): number {
  const levelSource = readLevelSource(data.levelSource);
  const headline = readNumber(data.level);
  const run = readNumber(data.runLevel);
  const cycle = readNumber(data.cycleLevel);

  if (levelSource === 'Cycling' && cycle != null && cycle > 0) return cycle;
  if (levelSource === 'Running' && run != null && run > 0) return run;
  if (headline != null && headline > 0) return headline;
  if (run != null && run > 0) return run;
  if (cycle != null && cycle > 0) return cycle;
  return 0;
}
