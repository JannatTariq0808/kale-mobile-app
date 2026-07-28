import { getFirebaseProjectId } from './firebase';

function envTrim(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

/**
 * HTTPS Cloud Function base for this Firebase project
 * (`https://europe-west2-{projectId}.cloudfunctions.net`).
 */
export function getCloudFunctionsBaseUrl(): string | undefined {
  const explicit = envTrim('EXPO_PUBLIC_CLOUD_FUNCTIONS_BASE_URL');
  if (explicit) return explicit.replace(/\/$/, '');

  const projectId = getFirebaseProjectId() || envTrim('EXPO_PUBLIC_FIREBASE_PROJECT_ID');
  if (!projectId) return undefined;

  return `https://europe-west2-${projectId}.cloudfunctions.net`;
}

export function cloudFunctionUrl(functionName: string): string | undefined {
  const base = getCloudFunctionsBaseUrl();
  if (!base) return undefined;
  return `${base}/${functionName.replace(/^\//, '')}`;
}
