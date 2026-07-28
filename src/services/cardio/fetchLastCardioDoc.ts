import { doc, getDoc, Timestamp } from 'firebase/firestore';
import type { KaleAssessment } from '../../types/assessment';
import { fetchAssessmentsForUser } from '../assessment/assessmentSession';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { CardioPlatform } from './fetchCardioSummary';

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

function readPlatform(value: unknown): CardioPlatform | null {
  if (value === 'strava' || value === 'garmin' || value === 'appleHealth') return value;
  return null;
}

export type LastCardioDocMeta = {
  createdAt: Date | null;
  platform: CardioPlatform | null;
  /** Set when resolved from an assessment anchor (for logs). */
  anchorAssessmentId?: string;
  anchorCardioDocId?: string;
  anchorIsOnboarding?: boolean;
};

function readCardioDocTimestamp(data: Record<string, unknown>): Date | null {
  return readTimestamp(data.created_at);
}

async function readCardioDocMeta(cardioDocId: string): Promise<LastCardioDocMeta | null> {
  const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', cardioDocId));
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  return {
    createdAt: readCardioDocTimestamp(data),
    platform: readPlatform(data.platform),
    anchorCardioDocId: cardioDocId,
  };
}

function logCardioSync(message: string, payload?: Record<string, unknown>): void {
  if (__DEV__) {
    console.log('[cardio-sync]', message, payload ?? '');
  }
}

/**
 * Quarterly cardio sync anchor: `created_at` on the cardio doc linked to the
 * last completed assessment (onboarding or quarterly — does not matter).
 * Skips the in-progress assessment so we never anchor on today's new doc.
 */
export async function fetchLastCardioDocMeta(
  uid: string,
  assessments?: KaleAssessment[],
  excludeAssessmentId?: string,
): Promise<LastCardioDocMeta> {
  try {
    const list = assessments ?? (await fetchAssessmentsForUser(uid)).assessments;

    logCardioSync('assessments loaded', {
      count: list.length,
      excludeAssessmentId,
      candidates: list.map((item) => ({
        id: item.id,
        isOnboarding: item.isOnboarding,
        is_completed: item.is_completed,
        cardio_id: item.cardio_id,
        created_at: item.created_at.toISOString(),
      })),
    });

    const completedWithCardio = list.filter(
      (item) => item.is_completed && item.cardio_id && item.id !== excludeAssessmentId,
    );

    const lastCompleted = completedWithCardio[0] ?? null;

    logCardioSync('anchor search', {
      completedWithCardioCount: completedWithCardio.length,
      selectedAssessmentId: lastCompleted?.id ?? null,
      selectedIsOnboarding: lastCompleted?.isOnboarding ?? null,
      selectedCardioId: lastCompleted?.cardio_id ?? null,
    });

    if (lastCompleted?.cardio_id) {
      const fromCardio = await readCardioDocMeta(lastCompleted.cardio_id);
      logCardioSync('cardio doc read', {
        cardioDocId: lastCompleted.cardio_id,
        created_at: fromCardio?.createdAt?.toISOString() ?? null,
        platform: fromCardio?.platform ?? null,
      });

      if (fromCardio?.createdAt) {
        return {
          ...fromCardio,
          anchorAssessmentId: lastCompleted.id,
          anchorIsOnboarding: lastCompleted.isOnboarding,
        };
      }
    }

    logCardioSync('no assessment anchor — trying live cardios/{uid}', { uid });
    const fromLive = await readCardioDocMeta(uid);
    if (fromLive?.createdAt) return fromLive;

    logCardioSync('no anchor found — will use 90-day fallback', {
      livePlatform: fromLive?.platform ?? null,
    });
    return { createdAt: null, platform: fromLive?.platform ?? null };
  } catch (error) {
    if (__DEV__) {
      console.warn('[cardio-sync] fetchLastCardioDocMeta failed', error);
    }
    return { createdAt: null, platform: null };
  }
}
