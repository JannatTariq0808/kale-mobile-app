import type { CountFilter, SportFilter } from '../data/fitnessDemo';

export function getActivityLogEmptyMessage(
  sportFilter: SportFilter,
  countFilter: CountFilter,
  periodLabel: string,
  hasAnyActivities: boolean,
): string {
  const period = periodLabel.toLowerCase();

  if (!hasAnyActivities) {
    return 'No activities synced yet. Connect Strava or Garmin to see your runs and rides here.';
  }

  if (sportFilter === 'Runs') {
    if (countFilter === 'Not counted') return `No excluded runs ${period}.`;
    if (countFilter === 'Counted') return `No counted runs ${period}.`;
    return `No runs ${period}.`;
  }

  if (sportFilter === 'Rides') {
    if (countFilter === 'Not counted') return `No excluded rides ${period}.`;
    if (countFilter === 'Counted') return `No counted rides ${period}.`;
    return `No rides ${period}.`;
  }

  if (countFilter === 'Counted') return `No counted activities ${period}.`;
  if (countFilter === 'Not counted') return `No excluded activities ${period}.`;
  return 'No activities match this filter.';
}
