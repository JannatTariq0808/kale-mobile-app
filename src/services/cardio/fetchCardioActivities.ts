import { collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import type { FitnessActivity } from '../../data/fitnessDemo';
import {
  cardioLookbackMonths,
  formatCardioLookbackPeriod,
  formatCountedLookbackLabel,
} from '../../utils/cardioLookback';
import { formatCardioPace } from '../../utils/cardioPerformance';
import { sortActivitiesByPace } from '../../utils/sortActivitiesByPace';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { CardioPlatform } from './fetchCardioSummary';

export type FetchCardioActivitiesOptions = {
  /** When provided, skips reading `cardios/{uid}` for platform lookup. */
  platform?: CardioPlatform | null;
};

export type CardioActivityLogSummary = {
  countedLabel: string;
  periodLabel: string;
  lookbackMonths: number;
  runCount: number;
  distanceKm: number;
};

export type CardioActivityLog = {
  summary: CardioActivityLogSummary;
  activities: FitnessActivity[];
};

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readPlatform(value: unknown): CardioPlatform | null {
  if (value === 'strava' || value === 'garmin' || value === 'appleHealth') return value;
  return null;
}

function readTimestamp(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as Timestamp).toDate === 'function'
  ) {
    return (value as Timestamp).toDate();
  }
  return null;
}

function formatActivityLogDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'am' : 'pm';
  const minuteLabel = String(minutes).padStart(2, '0');
  return `${day} ${month} · ${hour12}:${minuteLabel}${ampm}`;
}

function formatHeartRate(value: unknown): string {
  const hr = readNumber(value);
  return hr != null && hr > 0 ? String(Math.round(hr)) : '—';
}

function formatDistanceKm(distanceKm: number): string {
  return `${distanceKm.toFixed(1)}km`;
}

function activityName(
  type: 'run' | 'ride',
  distanceKm: number | null,
  rawName: unknown,
): string {
  if (typeof rawName === 'string' && rawName.trim()) return rawName.trim();
  if (distanceKm != null && distanceKm > 0) {
    return `${distanceKm.toFixed(1)} km ${type}`;
  }
  return type === 'ride' ? 'Ride' : 'Run';
}

function mapEligibleRun(data: Record<string, unknown>): FitnessActivity | null {
  const distanceKm = readNumber(data.distance);
  const timeMin = readNumber(data.time);
  const pace = readNumber(data.pace) ?? (distanceKm && timeMin ? timeMin / distanceKm : null);
  if (distanceKm == null || pace == null || pace <= 0) return null;

  const createdAt = readTimestamp(data.created_at) ?? new Date(0);

  return {
    type: 'run',
    name: activityName('run', distanceKm, data.name),
    date: formatActivityLogDate(createdAt),
    dist: formatDistanceKm(distanceKm),
    metric: formatCardioPace(pace),
    metricUnit: '/km',
    hr: formatHeartRate(data.average_heartrate),
    counted: data.eligible !== false,
    device: typeof data.device_name === 'string' ? data.device_name : undefined,
  };
}

function mapEligibleRide(data: Record<string, unknown>): FitnessActivity | null {
  const distanceKm = readNumber(data.distance);
  const speed = readNumber(data.speed);
  if (distanceKm == null || speed == null || speed <= 0) return null;

  const createdAt = readTimestamp(data.created_at) ?? new Date(0);

  return {
    type: 'ride',
    name: activityName('ride', distanceKm, data.name),
    date: formatActivityLogDate(createdAt),
    dist: formatDistanceKm(distanceKm),
    metric: speed.toFixed(1).replace(/\.0$/, ''),
    metricUnit: 'km/h',
    hr: formatHeartRate(data.average_heartrate),
    counted: data.eligible !== false,
    device: typeof data.device_name === 'string' ? data.device_name : undefined,
  };
}

function mapIneligibleActivity(
  kind: 'run' | 'ride',
  data: Record<string, unknown>,
): FitnessActivity | null {
  const distanceKm =
    readNumber(data.distance_km) ?? readNumber(data.distance);
  const timeMin = readNumber(data.time_min) ?? readNumber(data.time);
  if (distanceKm == null || timeMin == null) return null;

  const createdAt = readTimestamp(data.created_at) ?? new Date(0);
  const reason =
    typeof data.rejectLabel === 'string'
      ? data.rejectLabel
      : typeof data.rejectReason === 'string'
        ? data.rejectReason
        : 'Not counted';

  if (kind === 'run') {
    const pace = timeMin / distanceKm;
    return {
      type: 'run',
      name: activityName('run', distanceKm, data.name),
      date: formatActivityLogDate(createdAt),
      dist: formatDistanceKm(distanceKm),
      metric: formatCardioPace(pace),
      metricUnit: '/km',
      hr: formatHeartRate(data.average_heartrate),
      counted: false,
      reason,
      device: typeof data.device_name === 'string' ? data.device_name : undefined,
    };
  }

  const speed = distanceKm > 0 ? (distanceKm / timeMin) * 60 : null;
  if (speed == null || speed <= 0) return null;

  return {
    type: 'ride',
    name: activityName('ride', distanceKm, data.name),
    date: formatActivityLogDate(createdAt),
    dist: formatDistanceKm(distanceKm),
    metric: speed.toFixed(1).replace(/\.0$/, ''),
    metricUnit: 'km/h',
    hr: formatHeartRate(data.average_heartrate),
    counted: false,
    reason,
    device: typeof data.device_name === 'string' ? data.device_name : undefined,
  };
}

async function fetchCollectionActivities(
  uid: string,
  collectionName: string,
  mapRow: (data: Record<string, unknown>) => FitnessActivity | null,
): Promise<FitnessActivity[]> {
  try {
    const snap = await getDocs(
      collection(getFirebaseFirestore(), 'cardios', uid, collectionName),
    );
    return snap.docs
      .map((activityDoc) => mapRow(activityDoc.data() as Record<string, unknown>))
      .filter((activity): activity is FitnessActivity => activity != null);
  } catch (error) {
    if (__DEV__) {
      console.warn(`[cardio] fetch ${collectionName} failed`, error);
    }
    return [];
  }
}

function buildSummary(
  activities: FitnessActivity[],
  lookbackMonths: number,
): CardioActivityLogSummary {
  const countedRuns = activities.filter((a) => a.type === 'run' && a.counted);
  const countedDistanceKm = activities
    .filter((a) => a.counted)
    .reduce((sum, activity) => {
      const km = Number(activity.dist.replace(/km$/i, ''));
      return sum + (Number.isFinite(km) ? km : 0);
    }, 0);

  const lookbackLabel = formatCountedLookbackLabel(lookbackMonths);
  const periodLabel = formatCardioLookbackPeriod(lookbackMonths);

  return {
    countedLabel: lookbackLabel,
    periodLabel,
    lookbackMonths,
    runCount: countedRuns.length,
    distanceKm: Math.round(countedDistanceKm),
  };
}

export async function fetchCardioActivities(
  uid: string,
  options?: FetchCardioActivitiesOptions,
): Promise<CardioActivityLog> {
  let platform: CardioPlatform | null = null;

  if (options) {
    platform = options.platform ?? null;
  } else {
    try {
      const cardioSnap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
      if (cardioSnap.exists()) {
        platform = readPlatform(cardioSnap.data().platform);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[cardio] fetch platform for lookback failed', error);
      }
    }
  }

  const lookbackMonths = cardioLookbackMonths(platform);

  const [runs, rides, ineligibleRuns, ineligibleRides] = await Promise.all([
    fetchCollectionActivities(uid, 'runs', mapEligibleRun),
    fetchCollectionActivities(uid, 'cycling', mapEligibleRide),
    fetchCollectionActivities(uid, 'runs_ineligible', (data) =>
      mapIneligibleActivity('run', data),
    ),
    fetchCollectionActivities(uid, 'cycling_ineligible', (data) =>
      mapIneligibleActivity('ride', data),
    ),
  ]);

  const activities = sortActivitiesByPace([
    ...runs,
    ...rides,
    ...ineligibleRuns,
    ...ineligibleRides,
  ]);

  return {
    summary: buildSummary(activities, lookbackMonths),
    activities,
  };
}
