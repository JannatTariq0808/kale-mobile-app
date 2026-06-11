// Design: kale-mobile-design — lum-12 KaleHomeLumen (screens/KaleLumenApp.jsx)

/** Demo user — set assessmentCount > 1 to see multi-quarter charts. */
export const homeDemo = {
  firstName: 'Alex',
  level: 6,
  levelPct: 60,
  /**
   * Controls both home charts (same quarter count for each):
   * - `1` (or less) → Q1 summary card (level + lifespan / healthspan + CTA)
   * - `2` or more → trend charts with Q1…Q(n-1) + Now
   * - `> 4` → charts scroll horizontally (4 quarters visible at a time)
   */
  assessmentCount: 2,
  /**
   * Override the app clock to test assessment UI (uses device timezone):
   * - `'2026-01-15'` → live window; closes 1 Feb 12 AM local time (~16 days left)
   * - `'2026-01-15T18:00:00'` → same, with a specific local time of day
   * - `'2026-03-15'` → incoming / next assessment (between windows)
   * - `null` → real device date & timezone
   *
   * Windows follow the phone's timezone — Lahore (UTC+5) vs London (UTC+0) will differ by ~4–5h.
   */
  testNow: null as string | null,
  trendDelta: 1,
  kaletteReward: 486,
  lifespanYears: 4.2,
  healthspanYears: 6.8,
  pillarLevels: {
    cardio: 6,
    strength: 5,
    knowledge: 7,
  },
  runningYearsAhead: 31,
} as const;
