import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  ensureLocalNotificationsReady,
  LEVEL_REVEAL_CHANNEL_ID,
} from './ensureLocalNotificationsReady';

const NOTIFIED_PREFIX = 'kale.levelRevealLocalNotified.';

export type LevelRevealNotificationInput = {
  assessmentId: string;
  level: number;
  /** Onboarding vs quarterly — for analytics payload only. */
  isOnboarding?: boolean;
};

function storageKey(assessmentId: string): string {
  return `${NOTIFIED_PREFIX}${assessmentId}`;
}

function buildCopy(level: number): { title: string; body: string } {
  const safeLevel = Math.min(10, Math.max(1, Math.round(level)));
  return {
    title: 'Your level is in',
    body: `You're Longevity Level ${safeLevel}.`,
  };
}

/**
 * Immediate local notification when a longevity level is revealed.
 * Deduped per assessment so finalize + LevelReveal screen don't double-fire.
 */
export async function notifyLevelRevealed(
  input: LevelRevealNotificationInput,
): Promise<void> {
  const assessmentId = input.assessmentId?.trim();
  if (!assessmentId || !Number.isFinite(input.level) || input.level <= 0) {
    return;
  }

  try {
    const key = storageKey(assessmentId);
    const already = await AsyncStorage.getItem(key);
    if (already) {
      return;
    }

    const ready = await ensureLocalNotificationsReady();
    if (!ready) {
      return;
    }

    // Claim before scheduling so parallel callers don't double-send.
    await AsyncStorage.setItem(key, String(Math.round(input.level)));

    const Notifications = await import('expo-notifications');
    const { title, body } = buildCopy(input.level);

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: {
          type: 'level_reveal',
          assessmentId,
          level: Math.round(input.level),
          isOnboarding: input.isOnboarding === true,
        },
        ...(Platform.OS === 'android' ? { channelId: LEVEL_REVEAL_CHANNEL_ID } : {}),
      },
      trigger: null,
    });

    if (__DEV__) {
      console.log('[notifications] level reveal local notification', {
        assessmentId,
        level: Math.round(input.level),
        isOnboarding: input.isOnboarding,
        platform: Platform.OS,
      });
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] notifyLevelRevealed failed', error);
    }
  }
}
