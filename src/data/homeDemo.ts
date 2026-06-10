// Design: kale-mobile-design — lum-12 KaleHomeLumen (screens/KaleLumenApp.jsx)

/** Demo user — set assessmentCount > 1 to see multi-quarter charts. */
export const homeDemo = {
  firstName: 'Alex',
  level: 6,
  levelPct: 60,
  /**
   * Controls Health Years + Longevity Level charts on Longevity home:
   * - `1` (or less) → Q1 baseline timeline (no trend graphs)
   * - `2` or more → full trend charts (HealthYearsTrendChart, LongevityLevelTrendChart)
   */
  assessmentCount: 1,
  trendDelta: 1,
  weeksToAssessment: 9,
  daysToAssessment: 3,
  cycleProgressPct: 30,
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
