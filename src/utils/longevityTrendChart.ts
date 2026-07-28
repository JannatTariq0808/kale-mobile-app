import type { KaleAssessment } from '../types/assessment';
import { getLifeSpan } from './getLifeSpan';

/** Quarterly cycle label — C1, C2, … (not "Cycle 1"). */
export function formatCycleLabel(cycleNumber: number): string {
  return `C${Math.max(1, cycleNumber)}`;
}

/** X-axis label for a completed assessment in chronological order. */
export function assessmentTrendLabel(
  assessment: KaleAssessment,
  quarterlyIndex: number,
): string {
  if (assessment.isOnboarding) return 'Onboarding';
  return formatCycleLabel(quarterlyIndex);
}

/** Next cycle the user is working toward after their first assessment. */
export function nextCycleLabel(completedQuarterlyCount: number): string {
  return formatCycleLabel(completedQuarterlyCount + 1);
}

/** Modest projection bump for single-assessment trend charts. */
export function projectHealthYearsValue(value: number): number {
  if (value <= 0) return 0.2;
  return Math.round(value * 1.08 * 10) / 10;
}

export function projectLevelValue(level: number): number {
  return Math.min(10, Math.round((level + 0.4) * 10) / 10);
}
