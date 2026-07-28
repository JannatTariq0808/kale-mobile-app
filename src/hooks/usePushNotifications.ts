import { useEffect } from 'react';
import { Platform } from 'react-native';
import { registerPushToken } from '../services/notifications/registerPushToken';
import { supportsNativePush } from '../utils/expoRuntime';

/**
 * Register FCM token + present banners when a push arrives while the app is open.
 * Background / killed delivery still requires a `notification: { title, body }` payload
 * from Cloud Functions (data-only messages do not show on iOS).
 */
export function usePushNotifications(uid: string | undefined) {
  useEffect(() => {
    if (!uid) return;
    void registerPushToken(uid);
  }, [uid]);

  useEffect(() => {
    if (!uid || !supportsNativePush()) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    void (async () => {
      try {
        const messagingModule = await import('@react-native-firebase/messaging');
        const Notifications = await import('expo-notifications');
        const messaging = messagingModule.default;

        if (cancelled) return;

        unsubscribe = messaging().onMessage(async (remoteMessage) => {
          const title =
            remoteMessage.notification?.title ??
            remoteMessage.data?.title ??
            'Kale';
          const body =
            remoteMessage.notification?.body ??
            remoteMessage.data?.body ??
            remoteMessage.data?.message ??
            '';

          if (!body && !remoteMessage.notification) {
            if (__DEV__) {
              console.log('[push] foreground data-only message (no banner)', remoteMessage.data);
            }
            return;
          }

          await Notifications.scheduleNotificationAsync({
            content: {
              title: String(title),
              body: String(body),
              data: remoteMessage.data ?? {},
              sound: true,
            },
            trigger: null,
          });
        });

        if (__DEV__) {
          console.log('[push] foreground message listener ready', { platform: Platform.OS });
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[push] could not attach foreground listener', error);
        }
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [uid]);
}
