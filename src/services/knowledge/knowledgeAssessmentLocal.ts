import AsyncStorage from '@react-native-async-storage/async-storage';

function cacheKey(uid: string, setId: string) {
  return `kale.knowledgeAssessment.${uid}.${setId.toLowerCase()}`;
}

export async function getCachedKnowledgeAssessmentId(
  uid: string,
  setId: string,
): Promise<string | null> {
  const value = await AsyncStorage.getItem(cacheKey(uid, setId));
  return value?.trim() || null;
}

export async function setCachedKnowledgeAssessmentId(
  uid: string,
  setId: string,
  assessmentId: string,
): Promise<void> {
  await AsyncStorage.setItem(cacheKey(uid, setId), assessmentId);
}

export async function clearCachedKnowledgeAssessmentId(
  uid: string,
  setId: string,
): Promise<void> {
  await AsyncStorage.removeItem(cacheKey(uid, setId));
}
