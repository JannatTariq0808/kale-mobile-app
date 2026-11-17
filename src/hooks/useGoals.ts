import { useCallback, useEffect, useState } from 'react';
import { fetchGoals } from '../services/ip/goals';
import type { GoalsRecord } from '../types/goals';
import { useAuthSession } from './useAuthSession';

const EMPTY: GoalsRecord = { quarterGoal: null, coachGoals: null, coachingRequestedAt: null };

type GoalsState = { goals: GoalsRecord; loading: boolean };
type Listener = (state: GoalsState) => void;

const stateByUid = new Map<string, GoalsState>();
const listenersByUid = new Map<string, Set<Listener>>();
const inflight = new Map<string, Promise<void>>();

function publish(uid: string, state: GoalsState) {
  stateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function load(uid: string): Promise<void> {
  const existing = inflight.get(uid);
  if (existing) return existing;
  const previous = stateByUid.get(uid);
  publish(uid, { goals: previous?.goals ?? EMPTY, loading: true });

  const promise = fetchGoals(uid)
    .then((goals) => publish(uid, { goals, loading: false }))
    .catch((error) => {
      if (__DEV__) console.warn('[goals] fetchGoals failed', error);
      publish(uid, { goals: previous?.goals ?? EMPTY, loading: false });
    })
    .finally(() => inflight.delete(uid));
  inflight.set(uid, promise);
  return promise;
}

/** Re-read goals after a save so every Goals screen shows the new state. */
export function refreshGoals(uid: string): Promise<void> {
  return load(uid);
}

export function useGoals(): GoalsState & { refresh: () => void } {
  const { user } = useAuthSession();
  const uid = user?.uid;
  const [state, setState] = useState<GoalsState>(() =>
    uid ? (stateByUid.get(uid) ?? { goals: EMPTY, loading: true }) : { goals: EMPTY, loading: false },
  );

  useEffect(() => {
    if (!uid) {
      setState({ goals: EMPTY, loading: false });
      return;
    }
    const listener: Listener = (next) => setState(next);
    if (!listenersByUid.has(uid)) listenersByUid.set(uid, new Set());
    listenersByUid.get(uid)!.add(listener);
    const cached = stateByUid.get(uid);
    if (cached) listener(cached);
    void load(uid);
    return () => {
      listenersByUid.get(uid)?.delete(listener);
    };
  }, [uid]);

  const refresh = useCallback(() => {
    if (uid) void load(uid);
  }, [uid]);

  return { ...state, refresh };
}
