import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_NOTICE_KEY = 'kale.authNotice';

let memoryNotice: string | null = null;

/** Survives NavigationContainer remount when a non–policy holder is signed out. */
export async function setAuthNotice(message: string): Promise<void> {
  memoryNotice = message;
  try {
    await AsyncStorage.setItem(AUTH_NOTICE_KEY, message);
  } catch {
    // memory fallback is enough for the immediate sign-out remount
  }
}

/** Read and clear any pending auth error (e.g. not a policy holder). */
export async function consumeAuthNotice(): Promise<string | null> {
  const fromMemory = memoryNotice;
  memoryNotice = null;

  let fromStorage: string | null = null;
  try {
    fromStorage = await AsyncStorage.getItem(AUTH_NOTICE_KEY);
    if (fromStorage) await AsyncStorage.removeItem(AUTH_NOTICE_KEY);
  } catch {
    // ignore
  }

  return fromMemory ?? fromStorage;
}
