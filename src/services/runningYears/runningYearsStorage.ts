import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RunningYearsGoal } from '../../types/runningYears';
import {
  markIntroDismissedInFirestore,
  readIntroDismissedFromFirestore,
  readRunningYearsGoalFromFirestore,
  saveRunningYearsGoalToFirestore,
} from './runningYearsProfile';

const PREFIX = 'runningYears';

function key(uid: string, suffix: string): string {
  return `${PREFIX}:${uid}:${suffix}`;
}

export async function readRunningYearsGoal(uid: string): Promise<RunningYearsGoal | null> {
  const fromFirestore = await readRunningYearsGoalFromFirestore(uid);
  if (fromFirestore) {
    await AsyncStorage.setItem(key(uid, 'goal'), JSON.stringify(fromFirestore));
    return fromFirestore;
  }

  // Firestore has no goal — drop stale on-device cache (e.g. after Console reset).
  await AsyncStorage.removeItem(key(uid, 'goal'));

  return null;
}

export async function saveRunningYearsGoal(uid: string, goal: RunningYearsGoal): Promise<void> {
  await AsyncStorage.setItem(key(uid, 'goal'), JSON.stringify(goal));
  await saveRunningYearsGoalToFirestore(uid, goal);
}

export async function readIntroDismissed(uid: string): Promise<boolean> {
  const fromFirestore = await readIntroDismissedFromFirestore(uid);
  if (fromFirestore) {
    await AsyncStorage.setItem(key(uid, 'introDismissed'), '1');
    return true;
  }
  // Firestore says not dismissed — clear stale on-device cache.
  await AsyncStorage.removeItem(key(uid, 'introDismissed'));
  return false;
}

export async function markIntroDismissed(uid: string): Promise<void> {
  await AsyncStorage.setItem(key(uid, 'introDismissed'), '1');
  await markIntroDismissedInFirestore(uid);
}

export async function readLastRunningYearsSnapshot(
  uid: string,
): Promise<{ runningYears: number; quarterKey: string } | null> {
  const raw = await AsyncStorage.getItem(key(uid, 'snapshot'));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { runningYears: number; quarterKey: string };
    if (typeof parsed.runningYears === 'number' && typeof parsed.quarterKey === 'string') {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export async function saveRunningYearsSnapshot(
  uid: string,
  runningYears: number,
  quarterKey: string,
): Promise<void> {
  await AsyncStorage.setItem(
    key(uid, 'snapshot'),
    JSON.stringify({ runningYears, quarterKey }),
  );
}

export async function readManualRestingHr(uid: string): Promise<number | null> {
  const raw = await AsyncStorage.getItem(key(uid, 'restingHr'));
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export async function saveManualRestingHr(uid: string, restingHr: number): Promise<void> {
  await AsyncStorage.setItem(key(uid, 'restingHr'), String(Math.round(restingHr)));
}
