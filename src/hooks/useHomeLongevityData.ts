import { useCallback, useEffect, useState } from 'react';
import {
  fetchHomeLongevityData,
  type HomeLongevityData,
} from '../services/home/fetchHomeLongevityData';
import { useAuthSession } from './useAuthSession';

const EMPTY: HomeLongevityData = {
  firstName: 'Member',
  level: 1,
  levelPct: 10,
  trendDelta: null,
  showTrend: false,
  assessmentCount: 0,
  lifespanYears: 0,
  healthspanYears: 0,
  runningYearsAhead: 11,
  policyTermYears: null,
  policyCoverType: null,
  pillarLevels: { cardio: 1, strength: 1, knowledge: 1 },
  chartSeries: null,
  completedAssessmentThisQuarter: false,
};

export type HomeLongevityDataState = HomeLongevityData & {
  loading: boolean;
};

export type HomeLongevityDataResult = HomeLongevityDataState & {
  refresh: () => void;
};

let homeCache: ({ uid: string } & HomeLongevityData) | null = null;
const inflightLoads = new Map<string, Promise<HomeLongevityData>>();
type Listener = (state: HomeLongevityDataState) => void;
const listenersByUid = new Map<string, Set<Listener>>();
const latestStateByUid = new Map<string, HomeLongevityDataState>();

function stateFromData(data: HomeLongevityData, loading: boolean): HomeLongevityDataState {
  return { ...data, loading };
}

function publish(uid: string, state: HomeLongevityDataState): void {
  latestStateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function payloadFromCache(uid: string): HomeLongevityData | null {
  if (homeCache?.uid !== uid) return null;
  const { uid: _uid, ...payload } = homeCache;
  return payload;
}

async function loadHomeData(uid: string): Promise<HomeLongevityData> {
  const cached = payloadFromCache(uid);
  if (cached) return cached;

  publish(uid, stateFromData(EMPTY, true));

  const data = await fetchHomeLongevityData(uid);
  homeCache = { uid, ...data };
  publish(uid, stateFromData(data, false));
  return data;
}

function startHomeLoad(uid: string): void {
  if (payloadFromCache(uid) || inflightLoads.has(uid)) return;

  const promise = loadHomeData(uid);
  inflightLoads.set(uid, promise);
  void promise.finally(() => {
    inflightLoads.delete(uid);
  });
}

/** Drop cached home data so the next load hits Firestore (e.g. after an assessment). */
export function invalidateHomeLongevityData(uid?: string): void {
  if (!uid || homeCache?.uid === uid) homeCache = null;
}

/** Background refetch that keeps current data on screen (no loading spinner). */
async function refreshHomeData(uid: string): Promise<void> {
  if (inflightLoads.has(uid)) return;

  const promise = (async () => {
    const data = await fetchHomeLongevityData(uid);
    homeCache = { uid, ...data };
    publish(uid, stateFromData(data, false));
    return data;
  })();

  inflightLoads.set(uid, promise);
  try {
    await promise;
  } finally {
    inflightLoads.delete(uid);
  }
}

function subscribe(uid: string, listener: Listener): void {
  if (!listenersByUid.has(uid)) {
    listenersByUid.set(uid, new Set());
  }
  listenersByUid.get(uid)!.add(listener);

  const cached = payloadFromCache(uid);
  if (cached) {
    listener(stateFromData(cached, false));
    return;
  }

  const replay = latestStateByUid.get(uid);
  if (replay) {
    listener(replay);
  }

  startHomeLoad(uid);
}

/** Warm home data when the user reaches the main tabs. */
export function prefetchHomeLongevityData(uid: string | undefined): void {
  if (!uid) return;
  startHomeLoad(uid);
}

export function useHomeLongevityData(): HomeLongevityDataResult {
  const { user } = useAuthSession();
  const uid = user?.uid;

  const [state, setState] = useState<HomeLongevityDataState>(() => {
    if (!uid) return stateFromData(EMPTY, false);
    const cached = payloadFromCache(uid);
    if (cached) return stateFromData(cached, false);
    const replay = latestStateByUid.get(uid);
    if (replay) return replay;
    return stateFromData(EMPTY, true);
  });

  useEffect(() => {
    if (!uid) {
      setState(stateFromData(EMPTY, false));
      return;
    }

    const listener: Listener = (next) => setState(next);
    subscribe(uid, listener);

    return () => {
      listenersByUid.get(uid)?.delete(listener);
    };
  }, [uid]);

  const refresh = useCallback(() => {
    if (uid) void refreshHomeData(uid);
  }, [uid]);

  return { ...state, refresh };
}
