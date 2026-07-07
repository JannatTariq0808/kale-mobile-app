function envTrim(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

/** Dev only — skip the one-assessment-per-quarter gate on home / Kalettes. */
export function allowMultipleAssessmentsPerQuarter(): boolean {
  const raw = envTrim('EXPO_PUBLIC_ALLOW_MULTIPLE_ASSESSMENTS_PER_QUARTER');
  return raw === 'true' || raw === '1';
}

/** Dev only — call cloud function to create current quarter's assessment doc before starting. */
export function devSeedQuarterlyAssessmentEnabled(): boolean {
  const raw = envTrim('EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT');
  return raw === 'true' || raw === '1';
}

/** Cloud Function URL; defaults from EXPO_PUBLIC_FIREBASE_PROJECT_ID. */
export function getDevSeedQuarterlyAssessmentUrl(): string | undefined {
  const explicit = envTrim('EXPO_PUBLIC_DEV_SEED_QUARTERLY_ASSESSMENT_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const projectId = envTrim('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
  if (!projectId) return undefined;

  return `https://europe-west2-${projectId}.cloudfunctions.net/devSeedQuarterlyAssessment`;
}
