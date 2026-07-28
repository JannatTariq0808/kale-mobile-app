import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { fetchAssessmentsForUser } from '../assessment/assessmentSession';
import type { CardioType } from '../../utils/cardioPerformance';
import { resolveCardioDocLevel } from '../../utils/resolveCardioDocLevel';

export type CardioPlatform = 'strava' | 'garmin' | 'appleHealth';

export type Vo2SubmaximalMeta = {
  computedAt: Date | null;
  confidence: number | null;
  source: string | null;
  sampleCount: number | null;
};

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
  /** Garmin device VO₂max when stored separately from Kale formula estimate. */
  garminVo2max: number | null;
  /** Kale submaximal VO₂max calibrated from Garmin session heart rate. */
  vo2maxSubmaximal: number | null;
  vo2maxSubmaximalMeta: Vo2SubmaximalMeta | null;
  /** When set, clarifies what `vo2max` represents (e.g. garmin, kale, pace_hr). */
  vo2maxSource: string | null;
  /** Resting heart rate from device sync when available. */
  restingHr: number | null;
  assessedAt: Date | null;
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

function readTimestamp(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  return null;
}

function readSubmaximalMeta(data: Record<string, unknown>): Vo2SubmaximalMeta | null {
  const meta = data.vo2max_submaximal_meta ?? data.vo2maxSubmaximalMeta;
  if (!meta || typeof meta !== 'object') return null;
  const record = meta as Record<string, unknown>;
  return {
    computedAt:
      readTimestamp(record.computedAt) ??
      readTimestamp(record.computed_at),
    confidence: readNumber(record.confidence),
    source: typeof record.source === 'string' ? record.source : null,
    sampleCount: readNumber(record.sampleCount) ?? readNumber(record.sample_count),
  };
}

function readRestingHr(data: Record<string, unknown>): number | null {
  return (
    readNumber(data.resting_hr) ??
    readNumber(data.restingHr) ??
    readNumber(data.resting_heart_rate) ??
    readNumber(data.restingHeartRate)
  );
}

function readSubmaximalVo2(data: Record<string, unknown>): number | null {
  return readNumber(data.vo2max_submaximal) ?? readNumber(data.vo2maxSubmaximal);
}

function readVo2maxSource(data: Record<string, unknown>): string | null {
  const raw = data.vo2max_source ?? data.vo2maxSource;
  return typeof raw === 'string' && raw.trim() ? raw.trim().toLowerCase() : null;
}

function readGarminVo2max(data: Record<string, unknown>): number | null {
  return (
    readNumber(data.garmin_vo2max) ??
    readNumber(data.garminVo2max) ??
    readNumber(data.vo2max_garmin) ??
    readNumber(data.vo2maxGarmin)
  );
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
    garminVo2max: readGarminVo2max(data),
    restingHr: readRestingHr(data),
    vo2maxSubmaximal: readSubmaximalVo2(data),
    vo2maxSubmaximalMeta: readSubmaximalMeta(data),
    vo2maxSource: readVo2maxSource(data),
    assessedAt: readTimestamp(data.assessedAt) ?? readTimestamp(data.assessed_at),
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
 * Cardio doc used for display — prefers assessment-linked `cardio_id`, else live `cardios/{uid}`.
 */
export async function resolveCardioDocIdForUser(uid: string): Promise<string> {
  try {
    const { assessments } = await fetchAssessmentsForUser(uid);
    const linkedId =
      assessments.find((item) => item.is_completed && item.cardio_id)?.cardio_id ??
      assessments.find((item) => item.cardio_id)?.cardio_id ??
      null;
    return linkedId ?? uid;
  } catch {
    return uid;
  }
}

/**
 * Cardio summary for display — prefers the assessment-linked cardio doc
 * (`assessments.cardio_id`) so a later live sync does not overwrite a past cycle's level.
 */
export async function fetchCardioSummaryForUser(uid: string): Promise<CardioSummary | null> {
  try {
    const linkedId = await resolveCardioDocIdForUser(uid);
    if (linkedId !== uid) {
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
