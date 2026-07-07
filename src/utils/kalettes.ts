/** 1 Kalette = £0.01 (1 penny). */
export const KALETTE_VALUE_GBP = 0.01;

const MIN_LEVEL_PCT = 1;
const MAX_LEVEL_PCT = 10;

export function levelRebatePercent(level: number): number {
  return Math.min(MAX_LEVEL_PCT, Math.max(MIN_LEVEL_PCT, Math.round(level)));
}

/**
 * Kalettes earned for one assessment cycle at the user's Longevity Level.
 * Level 1 = 1% of monthly premium back, level 10 = 10% — paid as points (1 pt = 1p).
 */
export function monthlyKalettes(monthlyPremiumGbp: number, level: number): number {
  if (!Number.isFinite(monthlyPremiumGbp) || monthlyPremiumGbp <= 0) return 0;

  const rebateGbp = (monthlyPremiumGbp * levelRebatePercent(level)) / 100;
  return Math.round(rebateGbp / KALETTE_VALUE_GBP);
}

export function parseMonthlyPremium(value: unknown): number | null {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}
