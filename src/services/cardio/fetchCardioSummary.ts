import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { CardioType } from '../../utils/cardioPerformance';

export type CardioSummary = {
  assessmentStatus: string | null;
  level: number;
  levelSource: CardioType | null;
  vo2max: number | null;
  distanceKm: number | null;
  timeMin: number | null;
  paceMinPerKm: number | null;
  ftpPerKg: number | null;
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

export async function fetchCardioSummary(uid: string): Promise<CardioSummary | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
    if (!snap.exists()) return null;

    const data = snap.data();
    const distanceKm = readNumber(data.distance_5k);
    const timeMin = readNumber(data.time_5k);
    const paceMinPerKm =
      readNumber(data.fastest_predicted_5k) ??
      (distanceKm && timeMin ? timeMin / distanceKm : null);

    return {
      assessmentStatus:
        typeof data.assessmentStatus === 'string' ? data.assessmentStatus : null,
      level: readNumber(data.level) ?? 0,
      levelSource: readLevelSource(data.levelSource),
      vo2max: readNumber(data.vo2max),
      distanceKm,
      timeMin,
      paceMinPerKm,
      ftpPerKg: readNumber(data.ftp_per_kg),
      averagePace: readNumber(data.average_pace),
      averageDistance: readNumber(data.average_distance),
      averageTime: readNumber(data.average_time),
      runLevel: readNumber(data.runLevel),
      cycleLevel: readNumber(data.cycleLevel),
      deviceName: typeof data.device_name === 'string' ? data.device_name : null,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio] fetchCardioSummary failed', error);
    }
    return null;
  }
}
