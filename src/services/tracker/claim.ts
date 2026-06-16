import { kaleApiFetch } from './kaleApiClient';

export type ClaimStravaResult =
  | { ok: true; athleteId: number }
  | { ok: false; reason: 'none' | 'api'; message?: string };

export type ClaimGarminResult =
  | { ok: true; batchId: string; duplicateBackfill?: boolean }
  | { ok: false; reason: 'none' | 'api' | 'denied' | 'backfill'; message?: string };

export const GARMIN_DUPLICATE_BACKFILL_MESSAGE =
  'Garmin already synced your activities today. Your connection is saved — activities from that sync may still arrive. If nothing appears, try again tomorrow.';

export async function claimStravaConnection(
  idToken: string,
  pendingToken: string,
): Promise<ClaimStravaResult> {
  const res = await kaleApiFetch('/api/oauth/strava/claim', idToken, {
    method: 'POST',
    body: JSON.stringify({ pendingToken }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    connected?: boolean;
    error?: string;
    strava?: { athleteId: number };
  };

  if (!res.ok) {
    return {
      ok: false,
      reason: 'api',
      message: typeof data.error === 'string' ? data.error : `Claim failed (${res.status})`,
    };
  }

  if (!data.connected || !data.strava?.athleteId) {
    return { ok: false, reason: 'none' };
  }

  return { ok: true, athleteId: data.strava.athleteId };
}

export async function claimGarminConnection(
  idToken: string,
  pendingToken: string,
): Promise<ClaimGarminResult> {
  const res = await kaleApiFetch('/api/oauth/garmin/claim', idToken, {
    method: 'POST',
    body: JSON.stringify({ pendingToken }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    connected?: boolean;
    batchId?: string;
    error?: string;
    errorMessage?: string;
    duplicateBackfill?: boolean;
  };

  if (!res.ok) {
    return {
      ok: false,
      reason: 'api',
      message: typeof data.error === 'string' ? data.error : `Claim failed (${res.status})`,
    };
  }

  if (!data.connected) {
    if (data.error === 'Missing Historical Data Permission') {
      return {
        ok: false,
        reason: 'denied',
        message:
          'Garmin did not grant Historical Data access. Enable it in Garmin Connect and try again.',
      };
    }
    if (data.error === 'Duplicate backfill' || data.duplicateBackfill) {
      return {
        ok: false,
        reason: 'backfill',
        message:
          typeof data.errorMessage === 'string'
            ? data.errorMessage
            : GARMIN_DUPLICATE_BACKFILL_MESSAGE,
      };
    }
    return { ok: false, reason: 'none' };
  }

  if (!data.batchId) {
    return { ok: false, reason: 'api', message: 'Invalid claim response.' };
  }

  return {
    ok: true,
    batchId: data.batchId,
    duplicateBackfill: data.duplicateBackfill === true,
  };
}