import { resolveAppNow } from '../hooks/useAppNow';
import { buildAssessmentChartLabels } from '../utils/assessmentCycle';
import { homeDemo } from './homeDemo';

export function buildLevelTrend(count: number, currentLevel: number): number[] {
  const start = Math.max(1, currentLevel - (count - 1));
  return Array.from({ length: count }, (_, i) => start + i);
}

export function buildHealthYearsTrend(
  count: number,
  endLifespan: number,
  endHealthspan: number,
): { lifespan: number[]; healthspan: number[] } {
  const lifespan = Array.from({ length: count }, (_, i) =>
    round1(endLifespan - (count - 1 - i) * 0.4),
  );
  const healthspan = Array.from({ length: count }, (_, i) =>
    round1(endHealthspan - (count - 1 - i) * 0.6),
  );
  return { lifespan, healthspan };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/** Shared series for Health Years + Longevity Level — always the same quarter count. */
export function getHomeChartSeries() {
  const count = Math.max(2, homeDemo.assessmentCount);
  const labels = buildAssessmentChartLabels(count, resolveAppNow());
  const levels = buildLevelTrend(count, homeDemo.level);
  const { lifespan, healthspan } = buildHealthYearsTrend(
    count,
    homeDemo.lifespanYears,
    homeDemo.healthspanYears,
  );

  return { count, labels, levels, lifespan, healthspan };
}
