import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** Raw APNs device token from expo-notifications — not valid for Firebase Admin FCM send. */
export function isApnsDeviceToken(token: string): boolean {
  return /^[a-f0-9]{64}$/i.test(token.trim());
}

async function getTokenFromReactNativeFirebase(): Promise<string | null> {
  try {
    const messagingModule = await import('@react-native-firebase/messaging');
    const messaging = messagingModule.default;

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messagingModule.AuthorizationStatus.AUTHORIZED ||
        authStatus === messagingModule.AuthorizationStatus.PROVISIONAL;
      if (!enabled) return null;
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    const trimmed = token?.trim() || null;
    if (trimmed && isApnsDeviceToken(trimmed)) return null;
    return trimmed;
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] React Native Firebase messaging unavailable:', error);
    }
    return null;
  }
}

async function getTokenFromExpoNotifications(): Promise<string | null> {
  const Notifications = await import('expo-notifications');
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId ??
    undefined;

  try {
    const devicePush = await Notifications.getDevicePushTokenAsync();
    const trimmed = devicePush.data?.trim() || null;
    if (trimmed && Platform.OS === 'ios' && isApnsDeviceToken(trimmed)) {
      if (__DEV__) {
        console.warn(
          '[push] got APNs token on iOS — need @react-native-firebase/messaging rebuild for FCM',
        );
      }
      return null;
    }
    if (trimmed) return trimmed;
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] native device token unavailable:', error);
    }
  }

  if (!projectId) return null;

  try {
    const expoPush = await Notifications.getExpoPushTokenAsync({ projectId });
    return expoPush.data?.trim() || null;
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] expo push token unavailable:', error);
    }
    return null;
  }
}

/** FCM registration token for Cloud Functions `admin.messaging().send`. */
export async function resolveFcmToken(): Promise<string | null> {
  const fromFirebase = await getTokenFromReactNativeFirebase();
  if (fromFirebase) return fromFirebase;

  if (Platform.OS === 'ios') {
    return null;
  }

  return getTokenFromExpoNotifications();
}
