import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { fetchAssessmentsForUser } from '../assessment/assessmentSession';
import type { CardioType } from '../../utils/cardioPerformance';
import { resolveCardioDocLevel } from '../../utils/resolveCardioDocLevel';

export type CardioPlatform = 'strava' | 'garmin' | 'appleHealth';

export type CardioSummary = {
  assessmentStatus: string | null;
  level: number;
  levelSource: CardioType | null;
  platform: CardioPlatform | null;
  vo2max: number | null;
  distanceKm: number | null;
  timeMin: number | null;
  paceMinPerKm: number | null;
  ftpPerKg: number | null;
  /** Weighted power (W) from the headline ride — used to derive FTP/kg if missing. */
  headlinePowerWatts: number | null;
  headlineAvgHeartrate: number | null;
  averagePace: number | null;
  averageDistance: number | null;
  averageTime: number | null;
  runLevel: number | null;
  cycleLevel: number | null;
  deviceName: string | null;
};

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readLevelSource(value: unknown): CardioType | null {
  if (value === 'Running' || value === 'Cycling') return value;
  return null;
}

function readPlatform(value: unknown): CardioPlatform | null {
  if (value === 'strava' || value === 'garmin' || value === 'appleHealth') return value;
  return null;
}

function readDeviceName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

type HeadlineActivity = {
  deviceName: string | null;
  headlinePowerWatts: number | null;
  headlineAvgHeartrate: number | null;
  timeMin: number | null;
};

async function fetchHeadlineActivity(
  uid: string,
  levelSource: CardioType | null,
): Promise<HeadlineActivity | null> {
  const collectionName = levelSource === 'Cycling' ? 'cycling' : 'runs';
  const snap = await getDocs(collection(getFirebaseFirestore(), 'cardios', uid, collectionName));
  if (snap.empty) return null;

  let bestDoc: (typeof snap.docs)[number] | null = null;
  let bestWatts = -1;

  for (const activityDoc of snap.docs) {
    const row = activityDoc.data();
    if (levelSource === 'Cycling') {
      const watts =
        readNumber(row.weighted_average_watts) ?? readNumber(row.average_watts) ?? -1;
      if (watts > bestWatts) {
        bestWatts = watts;
        bestDoc = activityDoc;
      }
      continue;
    }

    if (!bestDoc) {
      bestDoc = activityDoc;
    }
  }

  if (!bestDoc) return null;

  const row = bestDoc.data();
  const watts =
    levelSource === 'Cycling'
      ? (readNumber(row.weighted_average_watts) ?? readNumber(row.average_watts))
      : null;

  return {
    deviceName: readDeviceName(row.device_name),
    headlinePowerWatts: watts,
    headlineAvgHeartrate: readNumber(row.average_heartrate),
    timeMin: readNumber(row.time),
  };
}

function parseCardioSummaryFromData(
  data: Record<string, unknown>,
  headline: HeadlineActivity | null,
): CardioSummary {
  const levelSource = readLevelSource(data.levelSource);
  const distanceKm = readNumber(data.distance_5k);
  let timeMin = readNumber(data.time_5k);
  const paceMinPerKm =
    readNumber(data.fastest_predicted_5k) ??
    (distanceKm && timeMin ? timeMin / distanceKm : null);

  let deviceName = readDeviceName(data.device_name);
  let headlinePowerWatts: number | null = null;
  let headlineAvgHeartrate: number | null = null;
  const ftpPerKg = readNumber(data.ftp_per_kg);

  if (headline) {
    deviceName = deviceName ?? headline.deviceName;
    headlinePowerWatts = headline.headlinePowerWatts;
    headlineAvgHeartrate = headline.headlineAvgHeartrate;
    timeMin = timeMin ?? headline.timeMin;
  }

  return {
    assessmentStatus:
      typeof data.assessmentStatus === 'string' ? data.assessmentStatus : null,
    level: resolveCardioDocLevel(data),
    levelSource,
    platform: readPlatform(data.platform),
    vo2max: readNumber(data.vo2max),
    distanceKm,
    timeMin,
    paceMinPerKm,
    ftpPerKg,
    headlinePowerWatts,
    headlineAvgHeartrate,
    averagePace: readNumber(data.average_pace),
    averageDistance: readNumber(data.average_distance),
    averageTime: readNumber(data.average_time),
    runLevel: readNumber(data.runLevel),
    cycleLevel: readNumber(data.cycleLevel),
    deviceName,
  };
}

/** Read `cardios/{cardioDocId}` — live doc (`uid`) or per-assessment frozen copy. */
export async function fetchCardioSummaryByDocId(
  cardioDocId: string,
  uid: string,
): Promise<CardioSummary | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', cardioDocId));
    if (!snap.exists()) return null;

    const data = snap.data() as Record<string, unknown>;
    const levelSource = readLevelSource(data.levelSource);
    const headline =
      cardioDocId === uid ? await fetchHeadlineActivity(uid, levelSource) : null;

    return parseCardioSummaryFromData(data, headline);
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio] fetchCardioSummaryByDocId failed', cardioDocId, error);
    }
    return null;
  }
}

/**
 * Cardio summary for display — prefers the assessment-linked cardio doc
 * (`assessments.cardio_id`) so a later live sync does not overwrite a past cycle's level.
 */
export async function fetchCardioSummaryForUser(uid: string): Promise<CardioSummary | null> {
  try {
    const { assessments } = await fetchAssessmentsForUser(uid);
    const linkedId =
      assessments.find((item) => item.is_completed && item.cardio_id)?.cardio_id ??
      assessments.find((item) => item.cardio_id)?.cardio_id ??
      null;

    if (linkedId) {
      const fromAssessment = await fetchCardioSummaryByDocId(linkedId, uid);
      if (fromAssessment && fromAssessment.level > 0) return fromAssessment;
    }

    return fetchCardioSummary(uid);
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio] fetchCardioSummaryForUser failed', error);
    }
    return fetchCardioSummary(uid);
  }
}

export async function fetchCardioSummary(uid: string): Promise<CardioSummary | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
    if (!snap.exists()) return null;

    const data = snap.data() as Record<string, unknown>;
    const levelSource = readLevelSource(data.levelSource);
    const headline = await fetchHeadlineActivity(uid, levelSource);

    return parseCardioSummaryFromData(data, headline);
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio] fetchCardioSummary failed', error);
    }
    return null;
  }
}
