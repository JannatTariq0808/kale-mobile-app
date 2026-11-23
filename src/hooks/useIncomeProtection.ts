import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { fetchIncomeProtection } from '../services/ip/incomeProtection';
import type { IncomeProtectionRecord } from '../types/incomeProtection';
import { useAuthSession } from './useAuthSession';

export type IncomeProtectionState = {
  record: IncomeProtectionRecord | null;
  /** True once the users doc has an incomeProtection map. */
  isIpCustomer: boolean;
  loading: boolean;
  /**
   * True once isIpCustomer can be trusted: from this launch's fetch, or from the
   * answer saved on the last launch. The tab bar waits for it so it never shows
   * the 4 life tabs first and then switches to the 5 IP tabs.
   */
  known: boolean;
};

const IDLE: IncomeProtectionState = {
  record: null,
  isIpCustomer: false,
  loading: false,
  known: false,
};

const IP_CUSTOMER_KEY_PREFIX = 'kale.ipCustomer.';

async function readCachedIpCustomer(uid: string): Promise<boolean | null> {
  try {
    const value = await AsyncStorage.getItem(IP_CUSTOMER_KEY_PREFIX + uid);
    return value === '1' ? true : value === '0' ? false : null;
  } catch {
    return null;
  }
}

function writeCachedIpCustomer(uid: string, isIpCustomer: boolean) {
  AsyncStorage.setItem(IP_CUSTOMER_KEY_PREFIX + uid, isIpCustomer ? '1' : '0').catch(() => {});
}

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

  // First load this launch: use last launch's answer straight away, so the
  // tabs appear at once and only change if the account really changed.
  if (!previous?.known) {
    void readCachedIpCustomer(uid).then((cached) => {
      const current = stateByUid.get(uid);
      if (cached == null || !current || current.known) return;
      publish(uid, { ...current, isIpCustomer: cached, known: true });
    });
  }

  const promise = fetchIncomeProtection(uid)
    .then((record) => {
      const isIpCustomer = record != null;
      writeCachedIpCustomer(uid, isIpCustomer);
      publish(uid, { record, isIpCustomer, loading: false, known: true });
    })
    .catch((error) => {
      if (__DEV__) {
        console.warn('[ip] fetchIncomeProtection failed', error);
      }
      // Don't hold the tab bar forever: fall back to what we had (or life tabs).
      publish(uid, { ...(stateByUid.get(uid) ?? previous ?? IDLE), loading: false, known: true });
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
