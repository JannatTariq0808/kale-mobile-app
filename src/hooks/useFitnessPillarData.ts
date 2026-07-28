import { useCallback, useEffect, useState } from 'react';
import type { CardioActivityLog } from '../services/cardio/fetchCardioActivities';
import {
  buildFitnessCardioVo2Data,
  fetchFitnessCardioFirstPaint,
  fetchFitnessKnowledgeData,
  fetchFitnessPillarLevels,
  fetchFitnessStrengthData,
  type FitnessCardioVo2Data,
  type FitnessKnowledgeData,
  type FitnessPillarLevels,
  type FitnessStrengthData,
} from '../services/fitness/fetchFitnessPillarData';
import { fetchDemographicsForAssess } from '../services/user/fetchHealthProfile';
import { useAuthSession } from './useAuthSession';

const EMPTY_LEVELS: FitnessPillarLevels = { cardio: 1, strength: 1, knowledge: 1 };

const EMPTY_LOG: CardioActivityLog = {
  summary: {
    countedLabel: 'Counted · 12 wks',
    periodLabel: 'Last 12 weeks',
    lookbackMonths: 3,
    runCount: 0,
    distanceKm: 0,
  },
  activities: [],
};

const EMPTY_STRENGTH: FitnessStrengthData = {
  level: 1,
  levelPct: 10,
  trendDelta: null,
  showTrend: false,
  percentileTop: null,
  percentileCohort: null,
  levelTrend: null,
  assessmentCount: 0,
  current: null,
  pastAssessments: [],
  currentTest: null,
};

const EMPTY_KNOWLEDGE: FitnessKnowledgeData = {
  level: 1,
  levelPct: 10,
  latestScore: 0,
  maxScore: 0,
  scorePct: 0,
  trendLabel: null,
  showTrend: false,
  scoreHistory: null,
  levelTrend: null,
  assessmentCount: 0,
  current: null,
  pastAssessments: [],
};

const EMPTY_CARDIO: FitnessCardioVo2Data = {
  level: 1,
  bestEstimate: null,
  unit: 'ml/kg/min',
  ratingLabel: null,
  cohortLabel: null,
  summary: 'Complete cardio assessment to see your estimate.',
  levelSource: null,
  deviceName: null,
  sources: [],
  formula: 'VO₂max ≈ 15 × (HRmax / HRrest)',
  formulaNote:
    'The Heart Rate Reserve method. Two data points, no effort required, reliable for tracking trends.',
  sportLabel: 'RUNNING',
  current: null,
};

type FitnessDataPayload = {
  levels: FitnessPillarLevels;
  strength: FitnessStrengthData;
  knowledge: FitnessKnowledgeData;
  cardio: FitnessCardioVo2Data;
  activityLog: CardioActivityLog;
};

export type FitnessPillarDataState = FitnessDataPayload & {
  cardioReady: boolean;
  pillarsLoading: boolean;
};

let fitnessCache: ({ uid: string } & FitnessDataPayload) | null = null;
const inflightLoads = new Map<string, Promise<void>>();
const latestStateByUid = new Map<string, FitnessPillarDataState>();
type LoadListener = (state: FitnessPillarDataState) => void;
const listenersByUid = new Map<string, Set<LoadListener>>();

function emptyPayload(): FitnessDataPayload {
  return {
    levels: EMPTY_LEVELS,
    strength: EMPTY_STRENGTH,
    knowledge: EMPTY_KNOWLEDGE,
    cardio: EMPTY_CARDIO,
    activityLog: EMPTY_LOG,
  };
}

function payloadFromCache(uid: string): FitnessDataPayload | null {
  if (fitnessCache?.uid !== uid) return null;
  const { uid: _uid, ...payload } = fitnessCache;
  return payload;
}

function mergeCache(uid: string, partial: Partial<FitnessDataPayload>): void {
  const existing = fitnessCache?.uid === uid ? fitnessCache : { uid, ...emptyPayload() };
  fitnessCache = {
    uid,
    levels: partial.levels ?? existing.levels,
    strength: partial.strength ?? existing.strength,
    knowledge: partial.knowledge ?? existing.knowledge,
    cardio: partial.cardio ?? existing.cardio,
    activityLog: partial.activityLog ?? existing.activityLog,
  };
}

function stateFromPayload(
  payload: FitnessDataPayload,
  cardioReady: boolean,
  pillarsLoading: boolean,
): FitnessPillarDataState {
  return { ...payload, cardioReady, pillarsLoading };
}

function publish(uid: string, state: FitnessPillarDataState): void {
  latestStateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function ensureListenerSet(uid: string): Set<LoadListener> {
  let set = listenersByUid.get(uid);
  if (!set) {
    set = new Set();
    listenersByUid.set(uid, set);
  }
  return set;
}

async function loadFitnessData(uid: string): Promise<void> {
  const cached = payloadFromCache(uid);
  if (cached) {
    publish(uid, stateFromPayload(cached, true, false));
    return;
  }

  publish(uid, stateFromPayload(emptyPayload(), false, true));

  const firstPaint = await fetchFitnessCardioFirstPaint(uid);
  const cardioPartial: FitnessDataPayload = {
    levels: {
      cardio: firstPaint.cardioLevel,
      strength: EMPTY_LEVELS.strength,
      knowledge: EMPTY_LEVELS.knowledge,
    },
    strength: EMPTY_STRENGTH,
    knowledge: EMPTY_KNOWLEDGE,
    cardio: firstPaint.cardio,
    activityLog: firstPaint.activityLog,
  };

  mergeCache(uid, cardioPartial);
  publish(uid, stateFromPayload(cardioPartial, true, true));

  const [levels, strength, knowledge, profile] = await Promise.all([
    fetchFitnessPillarLevels(uid, firstPaint.summary),
    fetchFitnessStrengthData(uid),
    fetchFitnessKnowledgeData(uid),
    fetchDemographicsForAssess(),
  ]);

  const cardioBase = buildFitnessCardioVo2Data(firstPaint.summary, profile);
  const cardio: FitnessCardioVo2Data = {
    ...cardioBase,
    level: levels.cardio,
    current: cardioBase.current ? { ...cardioBase.current, level: levels.cardio } : null,
  };

  const full: FitnessDataPayload = {
    levels,
    strength,
    knowledge,
    cardio,
    activityLog: firstPaint.activityLog,
  };

  mergeCache(uid, full);
  publish(uid, stateFromPayload(full, true, false));
}

function startFitnessLoad(uid: string): void {
  if (payloadFromCache(uid) || inflightLoads.has(uid)) return;

  const promise = loadFitnessData(uid);
  inflightLoads.set(uid, promise);
  void promise.finally(() => {
    inflightLoads.delete(uid);
  });
}

/** Drop cached fitness data so the next load hits Firestore. */
export function invalidateFitnessPillarData(uid?: string): void {
  if (!uid || fitnessCache?.uid === uid) fitnessCache = null;
}

/** Background refetch — keeps current data visible (no full-screen spinner). */
async function refreshFitnessData(uid: string): Promise<void> {
  if (inflightLoads.has(uid)) return;

  const promise = (async () => {
    const firstPaint = await fetchFitnessCardioFirstPaint(uid);
    const [levels, strength, knowledge, profile] = await Promise.all([
      fetchFitnessPillarLevels(uid, firstPaint.summary),
      fetchFitnessStrengthData(uid),
      fetchFitnessKnowledgeData(uid),
      fetchDemographicsForAssess(),
    ]);

    const cardioBase = buildFitnessCardioVo2Data(firstPaint.summary, profile);
    const cardio: FitnessCardioVo2Data = {
      ...cardioBase,
      level: levels.cardio,
      current: cardioBase.current ? { ...cardioBase.current, level: levels.cardio } : null,
    };

    const full: FitnessDataPayload = {
      levels,
      strength,
      knowledge,
      cardio,
      activityLog: firstPaint.activityLog,
    };

    mergeCache(uid, full);
    publish(uid, stateFromPayload(full, true, false));
  })();

  inflightLoads.set(uid, promise);
  try {
    await promise;
  } finally {
    inflightLoads.delete(uid);
  }
}

function subscribe(uid: string, listener: LoadListener): void {
  ensureListenerSet(uid).add(listener);

  const cached = payloadFromCache(uid);
  if (cached) {
    listener(stateFromPayload(cached, true, false));
    return;
  }

  const replay = latestStateByUid.get(uid);
  if (replay) {
    listener(replay);
  }

  startFitnessLoad(uid);
}

/** Warm fitness data as soon as the user reaches the main tabs. */
export function prefetchFitnessPillarData(uid: string | undefined): void {
  if (!uid) return;
  startFitnessLoad(uid);
}

export type FitnessPillarDataResult = FitnessPillarDataState & {
  refresh: () => void;
};

export function useFitnessPillarData(): FitnessPillarDataResult {
  const { user } = useAuthSession();
  const uid = user?.uid;

  const [state, setState] = useState<FitnessPillarDataState>(() => {
    if (!uid) {
      return stateFromPayload(emptyPayload(), false, false);
    }
    const cached = payloadFromCache(uid);
    if (cached) {
      return stateFromPayload(cached, true, false);
    }
    const replay = latestStateByUid.get(uid);
    if (replay) return replay;
    return stateFromPayload(emptyPayload(), false, true);
  });

  useEffect(() => {
    if (!uid) {
      setState(stateFromPayload(emptyPayload(), false, false));
      return;
    }

    const listener: LoadListener = (next) => setState(next);
    subscribe(uid, listener);

    return () => {
      listenersByUid.get(uid)?.delete(listener);
    };
  }, [uid]);

  const refresh = useCallback(() => {
    if (uid) void refreshFitnessData(uid);
  }, [uid]);

  return { ...state, refresh };
}
