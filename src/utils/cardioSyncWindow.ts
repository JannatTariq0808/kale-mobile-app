import type { CardioPlatform } from '../services/cardio/fetchCardioSummary';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
/** Garmin Connect historical backfill limit (approx. one calendar month). */
export const GARMIN_MAX_BACKFILL_DAYS = 30;

export type CardioSyncWindow = {
  since: Date;
  /** Human label for ConnectTracker copy. */
  periodLabel: string;
  cappedForGarmin: boolean;
};

/**
 * Quarterly cardio sync: from the last `cardios` doc through today.
 * Garmin is capped to the last 30 days when the gap is longer.
 */
export function resolveCardioSyncWindow(
  lastCardioCreatedAt: Date | null,
  now = new Date(),
  platform: CardioPlatform | null,
): CardioSyncWindow {
  const defaultSince = new Date(now.getTime() - 90 * MS_PER_DAY);
  const since = lastCardioCreatedAt ?? defaultSince;

  if (platform !== 'garmin') {
    return {
      since,
      periodLabel: formatSinceLabel(since, now),
      cappedForGarmin: false,
    };
  }

  const garminMinSince = new Date(now.getTime() - GARMIN_MAX_BACKFILL_DAYS * MS_PER_DAY);
  if (since < garminMinSince) {
    return {
      since: garminMinSince,
      periodLabel: 'the last month (Garmin limit)',
      cappedForGarmin: true,
    };
  }

  return {
    since,
    periodLabel: formatSinceLabel(since, now),
    cappedForGarmin: false,
  };
}

function formatSinceLabel(since: Date, now: Date): string {
  const days = Math.max(1, Math.round((now.getTime() - since.getTime()) / MS_PER_DAY));
  if (days <= 31) return `the last ${days} day${days === 1 ? '' : 's'}`;
  const weeks = Math.round(days / 7);
  return `the last ${weeks} week${weeks === 1 ? '' : 's'}`;
}
