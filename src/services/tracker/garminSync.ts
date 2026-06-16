import { kaleApiFetch } from './kaleApiClient';
import { GARMIN_DUPLICATE_BACKFILL_MESSAGE } from './claim';

export type GarminSyncStatusResult =
  | { status: 'processing' }
  | { status: 'error'; errorMessage: string }
  | {
      status: 'success';
      level: number;
      longevity_discount_pct: number;
    };

type SyncStatusPayload = GarminSyncStatusResult & {
  error?: string;
  hint?: string;
  backfillRequested?: boolean;
  duplicateBackfill?: boolean;
  activityDocCount?: number;
};

const NO_ELIGIBLE_MSG = 'No cycling or running activities found';

function normalizeSyncError(data: SyncStatusPayload): string {
  if (data.duplicateBackfill === true) {
    return GARMIN_DUPLICATE_BACKFILL_MESSAGE;
  }
  if (
    data.backfillRequested === true &&
    typeof data.errorMessage === 'string' &&
    data.errorMessage.includes(NO_ELIGIBLE_MSG)
  ) {
    return GARMIN_DUPLICATE_BACKFILL_MESSAGE;
  }
  if (typeof data.errorMessage === 'string' && data.errorMessage.trim()) {
    return data.errorMessage;
  }
  return 'Garmin sync failed.';
}

const POLL_MS = 2000;
const MAX_WAIT_MS = 300_000;

export async function pollGarminSyncStatus(
  idToken: string,
  batchId: string,
  options?: { duplicateBackfill?: boolean },
): Promise<GarminSyncStatusResult> {
  const deadline = Date.now() + MAX_WAIT_MS;
  let lastHint: string | undefined;
  let lastActivityCount = 0;
  let backfillRequested = options?.duplicateBackfill === true;
  let duplicateBackfill = options?.duplicateBackfill === true;

  while (Date.now() < deadline) {
    const res = await kaleApiFetch(
      `/api/garmin/sync-status?batchId=${encodeURIComponent(batchId)}`,
      idToken,
    );

    const data = (await res.json().catch(() => ({}))) as SyncStatusPayload;

    if (!res.ok) {
      return {
        status: 'error',
        errorMessage:
          typeof data.error === 'string' ? data.error : `Sync check failed (${res.status})`,
      };
    }

    if (typeof data.hint === 'string') {
      lastHint = data.hint;
    }
    if (typeof data.activityDocCount === 'number') {
      lastActivityCount = data.activityDocCount;
    }
    if (data.backfillRequested === true) {
      backfillRequested = true;
    }
    if (data.duplicateBackfill === true) {
      duplicateBackfill = true;
    }

    if (data.status === 'success') {
      if (typeof data.level !== 'number' || typeof data.longevity_discount_pct !== 'number') {
        return { status: 'error', errorMessage: 'Invalid sync response.' };
      }
      return data;
    }

    if (data.status === 'error') {
      return {
        status: 'error',
        errorMessage: normalizeSyncError(data),
      };
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }

  if ((duplicateBackfill || backfillRequested) && lastActivityCount === 0) {
    return {
      status: 'error',
      errorMessage: lastHint ?? GARMIN_DUPLICATE_BACKFILL_MESSAGE,
    };
  }

  return {
    status: 'error',
    errorMessage:
      lastHint ??
      'Garmin is still syncing your activities. Wait a minute and try connecting again.',
  };
}
