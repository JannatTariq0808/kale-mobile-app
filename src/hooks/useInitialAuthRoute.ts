import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../navigation/types';
import { isOnboardingCompleteForUser } from '../services/onboarding/onboardingState';
import type { User } from 'firebase/auth';

type InitialAuthRoute = keyof RootStackParamList | null;

/**
 * Where authenticated users should land: Main (returning) or ConnectTracker (onboarding).
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

    void isOnboardingCompleteForUser(user.uid).then((complete) => {
      if (cancelled) return;
      setRoute(complete ? 'Main' : 'ConnectTracker');
    });

    return () => {
      cancelled = true;
    };
  }, [sessionReady, user?.uid]);

  return route;
}
