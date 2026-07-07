import type { CardioPlatform } from '../services/cardio/fetchCardioSummary';

/** Garmin Connect sync window — Strava default is 3 calendar months (~12 weeks). */
export function cardioLookbackMonths(platform: CardioPlatform | null): number {
  if (platform === 'garmin') return 1;
  return 3;
}

export function formatCardioLookbackPeriod(months: number): string {
  if (months === 1) return 'Last month';
  if (months === 3) return 'Last 12 weeks';
  return `Last ${months} months`;
}

export function formatCountedLookbackLabel(months: number): string {
  if (months === 1) return 'Counted · 1 mth';
  if (months === 3) return 'Counted · 12 wks';
  return `Counted · ${months} mths`;
}
