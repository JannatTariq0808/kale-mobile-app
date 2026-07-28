import Constants from 'expo-constants';

function envTrim(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function extraFlag(key: 'allowMultipleAssessmentsPerQuarter' | 'devSeedQuarterlyAssessment'): boolean {
  const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;
  return extra?.[key] === true;
}

/** Dev only — skip the one-assessment-per-quarter gate on home / Kalettes. Ignored in release builds.
 *  When true, home keeps showing "Assessment live" even after you finish this quarter (for retesting).
 *  When false (default), finishing this quarter's assessment hides the live card.
 *  Restart Metro after changing: `npx expo start --clear`
 */
export function allowMultipleAssessmentsPerQuarter(): boolean {
  if (!__DEV__) return false;
  const raw = envTrim('EXPO_PUBLIC_ALLOW_MULTIPLE_ASSESSMENTS_PER_QUARTER');
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return extraFlag('allowMultipleAssessmentsPerQuarter');
}

/** Dev only — call cloud function to create current quarter's assessment doc before starting. */
export function devSeedQuarterlyAssessmentEnabled(): boolean {
  const raw = envTrim('EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT');
  if (raw === 'true' || raw === '1') return true;
  if (raw === 'false' || raw === '0') return false;
  return extraFlag('devSeedQuarterlyAssessment');
}

/** Cloud Function URL; defaults from EXPO_PUBLIC_FIREBASE_PROJECT_ID. */
export function getDevSeedQuarterlyAssessmentUrl(): string | undefined {
  const explicit = envTrim('EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const projectId = envTrim('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
  if (!projectId) return undefined;

  return `https://europe-west2-${projectId}.cloudfunctions.net/devSeedQuarterlyAssessment`;
}
