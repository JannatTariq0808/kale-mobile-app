import { useEffect, type RefObject } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { isOnboardingCompleteForUser } from '../services/onboarding/onboardingState';
import { enterMainApp } from '../services/auth/session';
import type { User } from 'firebase/auth';

/** If auth restores while still on Welcome, route to onboarding or Main. */
export function useAuthNavigationSync(
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>,
  user: User | null,
  sessionReady: boolean,
  navigationReady: boolean,
) {
  useEffect(() => {
    if (!sessionReady || !user || !navigationReady) return;

    const nav = navigationRef.current;
    if (!nav?.isReady()) return;

    const route = nav.getRootState()?.routes[nav.getRootState().index]?.name;
    if (route !== 'Welcome') return;

    void isOnboardingCompleteForUser(user.uid).then((complete) => {
      if (!nav.isReady()) return;
      const current = nav.getRootState()?.routes[nav.getRootState().index]?.name;
      if (current !== 'Welcome') return;

      if (complete) {
        enterMainApp(nav);
      } else {
        nav.navigate('ConnectTracker');
      }
    });
  }, [navigationReady, navigationRef, sessionReady, user?.uid]);
}
