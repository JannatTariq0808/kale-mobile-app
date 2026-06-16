import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_UID_KEY = 'kale.onboardingCompleteUid';

/** True when this user has finished onboarding and entered Main at least once. */
export async function isOnboardingCompleteForUser(uid: string): Promise<boolean> {
  const stored = await AsyncStorage.getItem(ONBOARDING_COMPLETE_UID_KEY);
  return stored === uid;
}

export async function markOnboardingComplete(uid: string): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_COMPLETE_UID_KEY, uid);
}

export async function clearOnboardingComplete(): Promise<void> {
  await AsyncStorage.removeItem(ONBOARDING_COMPLETE_UID_KEY);
}
