export type LifeSpanData = {
  lifeSpan: number;
  healthSpan: number;
};

const LIFE_SPAN_TABLE: ReadonlyArray<{
  level: number;
  life_span: number;
  health_span: number;
}> = [
  { level: 1, life_span: 0.0, health_span: 0.0 },
  { level: 2, life_span: 0.5, health_span: 0.6 },
  { level: 3, life_span: 1.0, health_span: 1.1 },
  { level: 4, life_span: 1.4, health_span: 1.7 },
  { level: 5, life_span: 1.9, health_span: 2.3 },
  { level: 6, life_span: 2.4, health_span: 2.9 },
  { level: 7, life_span: 2.9, health_span: 3.5 },
  { level: 8, life_span: 3.9, health_span: 4.6 },
  { level: 9, life_span: 5.0, health_span: 5.9 },
  { level: 10, life_span: 6.0, health_span: 7.0 },
];

/** Mirrors Flutter `getLifeSpan(athleteLevel)`. */
export function getLifeSpan(athleteLevel: number): LifeSpanData {
  const level = Math.max(0, Math.min(10, Math.floor(athleteLevel)));
  const item =
    LIFE_SPAN_TABLE.find((row) => row.level === level) ?? LIFE_SPAN_TABLE[0];

  return {
    lifeSpan: item.life_span,
    healthSpan: item.health_span,
  };
}

export function getNextLevelHealthSpanGain(athleteLevel: number): number | null {
  if (athleteLevel >= 10) return null;
  const current = getLifeSpan(athleteLevel);
  const next = getLifeSpan(athleteLevel + 1);
  return round1(next.healthSpan - current.healthSpan);
}

export function formatYearsAdded(years: number): string {
  const prefix = years >= 0 ? '+' : '';
  return `${prefix}${round1(years).toFixed(1)}`;
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
