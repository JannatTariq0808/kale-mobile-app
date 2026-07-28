import { Platform } from 'react-native';

export const LEVEL_REVEAL_CHANNEL_ID = 'level_reveal';
export const DEFAULT_CHANNEL_ID = 'default';

let readyPromise: Promise<boolean> | null = null;

/**
 * Permission + Android channels + foreground presentation handler.
 * Safe to call repeatedly; result is cached for the process lifetime.
 * Local notifications work in Expo Go and in native builds.
 */
export async function ensureLocalNotificationsReady(): Promise<boolean> {
  if (!readyPromise) {
    readyPromise = (async () => {
      try {
        const Notifications = await import('expo-notifications');

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
          }),
        });

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
            name: 'Kale updates',
            importance: Notifications.AndroidImportance.DEFAULT,
          });
          await Notifications.setNotificationChannelAsync(LEVEL_REVEAL_CHANNEL_ID, {
            name: 'Level reveals',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 120, 250],
          });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          if (__DEV__) {
            console.warn('[notifications] permission not granted:', finalStatus);
          }
          return false;
        }

        return true;
      } catch (error) {
        if (__DEV__) {
          console.warn('[notifications] ensureLocalNotificationsReady failed', error);
        }
        readyPromise = null;
        return false;
      }
    })();
  }

  return readyPromise;
}
