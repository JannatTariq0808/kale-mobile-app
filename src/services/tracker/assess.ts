import type { HealthProfileForAssess } from '../user/fetchHealthProfile';
import { kaleApiFetch } from './kaleApiClient';

export type AssessStravaResult =
  | { ok: true; level: number; longevity_discount_pct: number }
  | { ok: false; message: string };

export type AssessStravaOptions = {
  /** Only include activities on or after this instant (quarterly re-sync). */
  activitiesSince?: string;
  /** Parent assessment doc to link after cardio is saved. */
  assessmentId?: string;
};

export async function assessStravaActivities(
  idToken: string,
  profile: HealthProfileForAssess,
  options?: AssessStravaOptions,
): Promise<AssessStravaResult> {
  const res = await kaleApiFetch('/api/strava/assess', idToken, {
    method: 'POST',
    body: JSON.stringify({
      gender: profile.gender,
      date_of_birth: profile.date_of_birth,
      weight_kg: profile.weight_kg,
      ...(options?.activitiesSince ? { activities_since: options.activitiesSince } : {}),
      ...(options?.assessmentId ? { assessment_id: options.assessmentId } : {}),
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    level?: number;
    longevity_discount_pct?: number;
  };

  if (!res.ok) {
    return {
      ok: false,
      message: typeof data.error === 'string' ? data.error : `Assessment failed (${res.status})`,
    };
  }

  if (data.ok === false) {
    return {
      ok: false,
      message:
        typeof data.error === 'string'
          ? data.error
          : 'No qualifying cardio activities in the lookback window.',
    };
  }

  if (typeof data.level !== 'number' || typeof data.longevity_discount_pct !== 'number') {
    return { ok: false, message: 'Invalid assessment response.' };
  }

  return {
    ok: true,
    level: data.level,
    longevity_discount_pct: data.longevity_discount_pct,
  };
}
