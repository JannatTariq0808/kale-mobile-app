import { doc, getDoc } from 'firebase/firestore';
import type { CardioSummary } from './fetchCardioSummary';
import { getFirebaseFirestore } from '../auth/firebaseApp';

export type GarminVo2Metric = {
  value: number;
  updatedAt: Date | null;
};

function readNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readVo2FromRecord(data: Record<string, unknown>): number | null {
  const candidates = [
    data.vo2max,
    data.vo2Max,
    data.vo2_max,
    data.runningVo2Max,
    data.running_vo2max,
    data.garmin_vo2max,
    data.garminVo2max,
  ];

  for (const candidate of candidates) {
    const value = readNumber(candidate);
    if (value != null && value > 0) return value;
  }

  return null;
}

function readTimestamp(value: unknown): Date | null {
  if (value && typeof value === 'object' && 'toDate' in value) {
    const date = (value as { toDate: () => Date }).toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }
  return null;
}

/** Always pull Garmin device metrics when the user is on Garmin. */
export function shouldFetchGarminUserMetrics(summary: CardioSummary | null): boolean {
  return summary?.platform === 'garmin';
}

/** Latest Garmin device VO₂max from `garminUserMetrics/{uid}` when present. */
export async function fetchGarminVo2max(uid: string): Promise<GarminVo2Metric | null> {
  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'garminUserMetrics', uid));
    if (!snap.exists()) return null;

    const data = snap.data() as Record<string, unknown>;
    const value = readVo2FromRecord(data);
    if (value == null || value <= 0) return null;

    return {
      value,
      updatedAt:
        readTimestamp(data.updatedAt) ??
        readTimestamp(data.updated_at) ??
        readTimestamp(data.syncedAt) ??
        readTimestamp(data.created_at),
    };
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (__DEV__ && code !== 'permission-denied') {
      console.warn('[cardio] fetchGarminVo2max failed', error);
    }
    return null;
  }
}
