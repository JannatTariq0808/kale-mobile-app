import { deleteField, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type {
  CoachGoal,
  CoachGoalPillar,
  CoachGoals,
  GoalsRecord,
  QuarterGoal,
  QuarterGoalType,
} from '../../types/goals';
import { getFirebaseFirestore } from '../auth/firebaseApp';

const PILLARS: CoachGoalPillar[] = ['cardio', 'strength', 'knowledge', 'health'];

function toDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function readQuarterGoal(raw: unknown): QuarterGoal | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const type: QuarterGoalType | null = data.type === 'up' || data.type === 'hold' ? data.type : null;
  if (!type) return null;
  return {
    type,
    how: typeof data.how === 'string' ? data.how : '',
    levelAtSet: typeof data.levelAtSet === 'number' ? data.levelAtSet : null,
    window: typeof data.window === 'string' ? data.window : null,
    setAt: toDate(data.setAt),
  };
}

function readCoachGoal(raw: unknown): CoachGoal | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title) return null;
  const pillar = PILLARS.includes(data.pillar as CoachGoalPillar)
    ? (data.pillar as CoachGoalPillar)
    : 'cardio';
  return { pillar, title, note: typeof data.note === 'string' ? data.note : '' };
}

function readCoachGoals(raw: unknown): CoachGoals | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;
  const goals = Array.isArray(data.goals)
    ? data.goals.map(readCoachGoal).filter((goal): goal is CoachGoal => goal != null)
    : [];
  if (goals.length === 0) return null;
  return {
    coachName: typeof data.coachName === 'string' ? data.coachName : null,
    setAt: toDate(data.setAt),
    goals,
  };
}

export async function fetchGoals(uid: string): Promise<GoalsRecord> {
  const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  const data = snap.exists() ? snap.data() : undefined;
  return {
    quarterGoal: readQuarterGoal(data?.ipGoal),
    coachGoals: readCoachGoals(data?.coachGoals),
    coachingRequestedAt: toDate(data?.coachingRequestedAt),
  };
}

export type SaveQuarterGoalInput = {
  type: QuarterGoalType;
  how: string;
  levelAtSet: number | null;
  window: string | null;
};

/** The customer's own goal. One at a time; saving replaces it. Doesn't change the price. */
export async function saveQuarterGoal(uid: string, input: SaveQuarterGoalInput): Promise<void> {
  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
    ipGoal: {
      type: input.type,
      how: input.how.trim(),
      levelAtSet: input.levelAtSet,
      window: input.window,
      setAt: serverTimestamp(),
    },
  });
}

export async function clearQuarterGoal(uid: string): Promise<void> {
  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), { ipGoal: deleteField() });
}

/** Records that the customer asked for coaching, so the screen shows "Request sent". */
export async function markCoachingRequested(uid: string): Promise<void> {
  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), {
    coachingRequestedAt: serverTimestamp(),
  });
}
