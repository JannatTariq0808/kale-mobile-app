import { useEffect, useState } from 'react';
import { fetchIncomeProtection } from '../services/ip/incomeProtection';
import type { IncomeProtectionRecord } from '../types/incomeProtection';
import { useAuthSession } from './useAuthSession';

export type IncomeProtectionState = {
  record: IncomeProtectionRecord | null;
  /** True once the users doc has an incomeProtection map. */
  isIpCustomer: boolean;
  loading: boolean;
};

const IDLE: IncomeProtectionState = { record: null, isIpCustomer: false, loading: false };

type Listener = (state: IncomeProtectionState) => void;
const stateByUid = new Map<string, IncomeProtectionState>();
const listenersByUid = new Map<string, Set<Listener>>();
const inflight = new Map<string, Promise<void>>();

function publish(uid: string, state: IncomeProtectionState) {
  stateByUid.set(uid, state);
  listenersByUid.get(uid)?.forEach((listener) => listener(state));
}

function load(uid: string): Promise<void> {
  const existing = inflight.get(uid);
  if (existing) return existing;

  const previous = stateByUid.get(uid);
  publish(uid, { ...(previous ?? IDLE), loading: true });

  const promise = fetchIncomeProtection(uid)
    .then((record) => {
      publish(uid, { record, isIpCustomer: record != null, loading: false });
    })
    .catch((error) => {
      if (__DEV__) {
        console.warn('[ip] fetchIncomeProtection failed', error);
      }
      publish(uid, { ...(previous ?? IDLE), loading: false });
    })
    .finally(() => {
      inflight.delete(uid);
    });
  inflight.set(uid, promise);
  return promise;
}

export function prefetchIncomeProtection(uid: string | undefined): void {
  if (!uid || stateByUid.has(uid)) return;
  void load(uid);
}

export async function refreshIncomeProtection(uid: string): Promise<void> {
  await load(uid);
}

export function useIncomeProtection(): IncomeProtectionState {
  const { user } = useAuthSession();
  const uid = user?.uid;

  const [state, setState] = useState<IncomeProtectionState>(() =>
    uid ? (stateByUid.get(uid) ?? { ...IDLE, loading: true }) : IDLE,
  );

  useEffect(() => {
    if (!uid) {
      setState(IDLE);
      return;
    }

    const listener: Listener = (next) => setState(next);
    if (!listenersByUid.has(uid)) listenersByUid.set(uid, new Set());
    listenersByUid.get(uid)!.add(listener);

    const cached = stateByUid.get(uid);
    if (cached) {
      listener(cached);
    } else {
      void load(uid);
    }

    return () => {
      listenersByUid.get(uid)?.delete(listener);
    };
  }, [uid]);

  return state;
}
