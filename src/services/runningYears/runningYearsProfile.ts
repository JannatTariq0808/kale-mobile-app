import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import type { RunningYearsGoal } from '../../types/runningYears';
import { getFirebaseFirestore } from '../auth/firebaseApp';

function readGoal(data: Record<string, unknown>): RunningYearsGoal | null {
  const goalId =
    typeof data.running_years_goal_id === 'string'
      ? data.running_years_goal_id
      : typeof data.runningYearsGoalId === 'string'
        ? data.runningYearsGoalId
        : null;
  const targetAgeRaw = data.running_years_target_age ?? data.runningYearsTargetAge;
  const targetAge = typeof targetAgeRaw === 'number' ? targetAgeRaw : null;

  if (!goalId || targetAge == null) return null;
  return { goalId, targetAge };
}

export async function readRunningYearsGoalFromFirestore(uid: string): Promise<RunningYearsGoal | null> {
  if (!isFirebaseConfigured()) return null;

  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    if (!snap.exists()) return null;
    return readGoal(snap.data() as Record<string, unknown>);
  } catch (error) {
    if (__DEV__) {
      console.warn('[running-years] read goal from Firestore failed', error);
    }
    return null;
  }
}

export async function saveRunningYearsGoalToFirestore(
  uid: string,
  goal: RunningYearsGoal,
): Promise<void> {
  if (!isFirebaseConfigured()) return;

  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
    running_years_goal_id: goal.goalId,
    running_years_target_age: goal.targetAge,
    running_years_goal_updated_at: serverTimestamp(),
  });
}

export async function readIntroDismissedFromFirestore(uid: string): Promise<boolean> {
  if (!isFirebaseConfigured()) return false;

  try {
    const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
    if (!snap.exists()) return false;
    const data = snap.data() as Record<string, unknown>;
    return data.running_years_intro_dismissed === true || data.runningYearsIntroDismissed === true;
  } catch {
    return false;
  }
}

export async function markIntroDismissedInFirestore(uid: string): Promise<void> {
  if (!isFirebaseConfigured()) return;

  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
    running_years_intro_dismissed: true,
    running_years_intro_dismissed_at: serverTimestamp(),
  });
}
