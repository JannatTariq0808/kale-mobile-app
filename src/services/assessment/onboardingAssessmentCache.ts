import AsyncStorage from '@react-native-async-storage/async-storage';

const ASSESSMENT_IDS_KEY = 'kale.assessmentIds';

function cacheKey(uid: string) {
  return `${ASSESSMENT_IDS_KEY}.${uid}`;
}

/** Most recently known assessment doc ids for this user (newest first). */
export async function getCachedAssessmentIds(uid: string): Promise<string[]> {
  const raw = await AsyncStorage.getItem(cacheKey(uid));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
}

export async function rememberAssessmentIds(uid: string, ids: string[]): Promise<void> {
  const trimmed = ids.map((id) => id.trim()).filter(Boolean);
  if (trimmed.length === 0) return;

  const existing = await getCachedAssessmentIds(uid);
  const merged = [...new Set([...trimmed, ...existing])].slice(0, 20);
  await AsyncStorage.setItem(cacheKey(uid), JSON.stringify(merged));
}

export async function rememberAssessmentId(uid: string, id: string): Promise<void> {
  const trimmed = id.trim();
  if (!trimmed) return;
  await rememberAssessmentIds(uid, [trimmed]);
}
