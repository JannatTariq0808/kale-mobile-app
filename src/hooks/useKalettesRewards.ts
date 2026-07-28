import { useEffect, useMemo, useState } from 'react';
import { fetchAssessmentsForUser } from '../services/assessment/assessmentSession';
import { fetchQuoteKalettes } from '../services/kalettes/fetchQuoteKalettes';
import { fetchActiveQuote } from '../services/quotes/fetchActiveQuote';
import { fetchUserAthleteLevel } from '../services/user/athleteLevel';
import { monthlyKalettes } from '../utils/kalettes';
import {
  formatAssessmentWindowCycleLabel,
  hasCompletedAssessmentThisQuarter,
} from '../utils/assessmentCycle';
import { useAppNow } from './useAppNow';
import { useAuthSession } from './useAuthSession';

export type KalettesRewardsState = {
  loading: boolean;
  hasQuote: boolean;
  bankedBalance: number;
  pendingKalettes: number;
  monthlyPremiumGbp: number;
  level: number;
  monthlyKalettes: number;
  cycleHeadline: string;
  cycleSubline: string;
  windowProgressPct: number;
  windowLive: boolean;
  completedAssessmentThisQuarter: boolean;
};

const EMPTY: KalettesRewardsState = {
  loading: true,
  hasQuote: false,
  bankedBalance: 0,
  pendingKalettes: 0,
  monthlyPremiumGbp: 0,
  level: 1,
  monthlyKalettes: 0,
  cycleHeadline: '',
  cycleSubline: '',
  windowProgressPct: 0,
  windowLive: false,
  completedAssessmentThisQuarter: false,
};

let kalettesCache: ({ uid: string } & KalettesRewardsState) | null = null;
const inflightLoads = new Map<string, Promise<KalettesRewardsState>>();
type Listener = (state: KalettesRewardsState) => void;
const listenersByUid = new Map<string, Set<Listener>>();
const latestStateByUid = new Map<string, KalettesRewardsState>();

function publish(uid: string, state: KalettesRewardsState): void {
  latestStateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function payloadFromCache(uid: string): KalettesRewardsState | null {
  if (kalettesCache?.uid !== uid) return null;
  const { uid: _uid, ...payload } = kalettesCache;
  return payload;
}

async function loadKalettesRewards(uid: string): Promise<KalettesRewardsState> {
  const [kalettes, quote, athleteLevel, { assessments }] = await Promise.all([
    fetchQuoteKalettes(uid),
    fetchActiveQuote(uid),
    fetchUserAthleteLevel(uid),
    fetchAssessmentsForUser(uid),
  ]);

  const completedAssessmentThisQuarter = hasCompletedAssessmentThisQuarter(assessments);

  if (!quote) {
    return {
      ...EMPTY,
      loading: false,
      hasQuote: false,
      bankedBalance: kalettes.balance,
      pendingKalettes: kalettes.pending,
      level: athleteLevel,
      completedAssessmentThisQuarter,
    };
  }

  const monthlyTotal = monthlyKalettes(quote.monthlyPremiumGbp, athleteLevel);

  return {
    loading: false,
    hasQuote: true,
    bankedBalance: kalettes.balance,
    pendingKalettes: kalettes.pending,
    monthlyPremiumGbp: quote.monthlyPremiumGbp,
    level: athleteLevel,
    monthlyKalettes: monthlyTotal,
    cycleHeadline: '',
    cycleSubline: '',
    windowProgressPct: 0,
    windowLive: false,
    completedAssessmentThisQuarter,
  };
}

function startKalettesLoad(uid: string, force = false): void {
  if (!force && inflightLoads.has(uid)) return;

  const cached = force ? null : payloadFromCache(uid);
  publish(uid, { ...(cached ?? EMPTY), loading: !cached });

  const promise = loadKalettesRewards(uid).then((data) => {
    kalettesCache = { uid, ...data };
    publish(uid, data);
    return data;
  });

  inflightLoads.set(uid, promise);
  void promise.finally(() => {
    inflightLoads.delete(uid);
  });
}

function subscribe(uid: string, listener: Listener): void {
  if (!listenersByUid.has(uid)) {
    listenersByUid.set(uid, new Set());
  }
  listenersByUid.get(uid)!.add(listener);

  const cached = payloadFromCache(uid);
  if (cached) {
    listener(cached);
  } else {
    const replay = latestStateByUid.get(uid);
    if (replay) {
      listener(replay);
    }
  }

  startKalettesLoad(uid);
}

/** Drop cache so the next subscribe / prefetch reloads from Firestore. */
export function invalidateKalettesRewards(uid?: string): void {
  if (uid) {
    if (kalettesCache?.uid === uid) kalettesCache = null;
    latestStateByUid.delete(uid);
    inflightLoads.delete(uid);
    return;
  }
  kalettesCache = null;
  latestStateByUid.clear();
  inflightLoads.clear();
}

export function prefetchKalettesRewards(uid: string | undefined): void {
  if (!uid) return;
  startKalettesLoad(uid);
}

export function refreshKalettesRewards(uid: string | undefined): void {
  if (!uid) return;
  invalidateKalettesRewards(uid);
  startKalettesLoad(uid, true);
}

export function useKalettesRewards(): KalettesRewardsState {
  const { user } = useAuthSession();
  const now = useAppNow(false);
  const uid = user?.uid;

  const [state, setState] = useState<KalettesRewardsState>(() => {
    if (!uid) return { ...EMPTY, loading: false };
    const cached = payloadFromCache(uid);
    if (cached) return cached;
    const replay = latestStateByUid.get(uid);
    if (replay) return replay;
    return EMPTY;
  });

  const windowLabel = useMemo(() => {
    const label = formatAssessmentWindowCycleLabel(now, {
      completedThisQuarter: state.completedAssessmentThisQuarter,
    });
    return {
      cycleHeadline: label.headline,
      cycleSubline: label.subline,
      windowProgressPct: label.windowProgressPct,
      windowLive: label.windowLive,
    };
  }, [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    state.completedAssessmentThisQuarter,
  ]);

  useEffect(() => {
    if (!uid) {
      setState({ ...EMPTY, loading: false });
      return;
    }

    const listener: Listener = (next) => setState(next);
    subscribe(uid, listener);

    return () => {
      listenersByUid.get(uid)?.delete(listener);
    };
  }, [uid]);

  return { ...state, ...windowLabel };
}
