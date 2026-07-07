import type { FitnessActivity } from '../data/fitnessDemo';

function parsePaceMinPerKm(metric: string): number | null {
  const trimmed = metric.trim();
  if (!trimmed.includes(':')) {
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const [minutesPart, secondsPart] = trimmed.split(':');
  const minutes = Number(minutesPart);
  const seconds = Number(secondsPart);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
  return minutes + seconds / 60;
}

/** Higher score = faster activity (runs: lower min/km; rides: higher km/h). */
export function activityPaceSortScore(activity: FitnessActivity): number {
  if (activity.metricUnit === '/km') {
    const pace = parsePaceMinPerKm(activity.metric);
    if (pace == null || pace <= 0) return Number.NEGATIVE_INFINITY;
    return -pace;
  }

  if (activity.metricUnit === 'km/h') {
    const speed = Number(activity.metric);
    return Number.isFinite(speed) ? speed : Number.NEGATIVE_INFINITY;
  }

  return Number.NEGATIVE_INFINITY;
}

export function sortActivitiesByPace(activities: FitnessActivity[]): FitnessActivity[] {
  return [...activities].sort(
    (a, b) => activityPaceSortScore(b) - activityPaceSortScore(a),
  );
}
