import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../navigation/types';
import { resolvePostAuthRoute } from '../services/onboarding/resolvePostAuthRoute';
import type { User } from 'firebase/auth';

type InitialAuthRoute = keyof RootStackParamList | null;

/**
 * Where authenticated users should land: Main (returning), CardioResult (assessed),
 * or ConnectTracker (onboarding).
 */
export function useInitialAuthRoute(
  user: User | null,
  sessionReady: boolean,
): InitialAuthRoute {
  const [route, setRoute] = useState<InitialAuthRoute>(null);

  useEffect(() => {
    if (!sessionReady) {
      setRoute(null);
      return;
    }

    if (!user) {
      setRoute(null);
      return;
    }

    let cancelled = false;

    void resolvePostAuthRoute(user.uid).then((next) => {
      if (cancelled) return;
      if (__DEV__) {
        console.log('[auth] initial route:', next);
      }
      setRoute(next);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionReady, user?.uid]);

  return route;
}
