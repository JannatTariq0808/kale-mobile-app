import * as Device from 'expo-device';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Platform } from 'react-native';
import { isFirebaseConfigured } from '../../config/firebase';
import { supportsNativePush } from '../../utils/expoRuntime';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { ensureLocalNotificationsReady } from './ensureLocalNotificationsReady';
import { resolveFcmToken } from './resolveFcmToken';

function deviceTokenDocId(): string {
  const model = (Device.modelName ?? 'device').replace(/\s+/g, '_').slice(0, 40);
  return `${Platform.OS}_${model}`;
}

/** Saves the FCM registration token for Cloud Functions `sendPush`. */
export async function registerPushToken(uid: string): Promise<void> {
  if (!uid || !isFirebaseConfigured() || !Device.isDevice || !supportsNativePush()) {
    if (__DEV__ && !supportsNativePush()) {
      console.log('[push] skipped in Expo Go — use a dev build for push notifications');
    }
    return;
  }

  const ready = await ensureLocalNotificationsReady();
  if (!ready) {
    if (__DEV__) {
      console.warn('[push] notification permission not granted');
    }
    return;
  }

  const token = await resolveFcmToken();

  if (!token) {
    if (__DEV__) {
      console.warn(
        '[push] no FCM token — on iOS rebuild with @react-native-firebase/messaging after prebuild',
      );
    }
    return;
  }

  const tokenDocId = deviceTokenDocId();
  try {
    const db = getFirebaseFirestore();
    await setDoc(
      doc(db, 'users', uid, 'fcm_tokens', tokenDocId),
      {
        fcm_token: token,
        platform: Platform.OS,
        token_kind: 'fcm',
        updated_at: serverTimestamp(),
      },
      { merge: true },
    );
    if (__DEV__) {
      console.log('[push] FCM token saved', {
        uid,
        tokenDocId,
        platform: Platform.OS,
        tokenPreview: `${token.slice(0, 16)}…`,
      });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[push] failed to save FCM token (check Firestore fcm_tokens rules):', error);
    }
  }
}
