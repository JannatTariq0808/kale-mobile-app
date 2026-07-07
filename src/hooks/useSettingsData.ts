import { useEffect, useState } from 'react';
import { fetchSettingsData, type SettingsData } from '../services/settings/fetchSettingsData';
import { useAuthSession } from './useAuthSession';

const EMPTY: SettingsData = {
  displayName: 'Member',
  email: '',
  memberSince: null,
  photoUrl: null,
  weightKg: null,
};

export type SettingsDataState = SettingsData & {
  loading: boolean;
};

let settingsCache: ({ uid: string } & SettingsData) | null = null;
const inflightLoads = new Map<string, Promise<SettingsData>>();
type Listener = (state: SettingsDataState) => void;
const listenersByUid = new Map<string, Set<Listener>>();
const latestStateByUid = new Map<string, SettingsDataState>();

function stateFromData(data: SettingsData, loading: boolean): SettingsDataState {
  return { ...data, loading };
}

function publish(uid: string, state: SettingsDataState): void {
  latestStateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function payloadFromCache(uid: string): SettingsData | null {
  if (settingsCache?.uid !== uid) return null;
  const { uid: _uid, ...payload } = settingsCache;
  return payload;
}

async function loadSettingsData(uid: string): Promise<SettingsData> {
  const cached = payloadFromCache(uid);
  if (cached) return cached;

  publish(uid, stateFromData(EMPTY, true));

  const data = await fetchSettingsData(uid);
  settingsCache = { uid, ...data };
  publish(uid, stateFromData(data, false));
  return data;
}

function startSettingsLoad(uid: string): void {
  if (payloadFromCache(uid) || inflightLoads.has(uid)) return;

  const promise = loadSettingsData(uid);
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
    listener(stateFromData(cached, false));
    return;
  }

  const replay = latestStateByUid.get(uid);
  if (replay) {
    listener(replay);
  }

  startSettingsLoad(uid);
}

export function prefetchSettingsData(uid: string | undefined): void {
  if (!uid) return;
  startSettingsLoad(uid);
}

export async function refreshSettingsData(uid: string): Promise<SettingsData> {
  settingsCache = null;
  inflightLoads.delete(uid);
  latestStateByUid.delete(uid);
  return loadSettingsData(uid);
}

export function useSettingsData(): SettingsDataState {
  const { user } = useAuthSession();
  const uid = user?.uid;

  const [state, setState] = useState<SettingsDataState>(() => {
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

  return state;
}
