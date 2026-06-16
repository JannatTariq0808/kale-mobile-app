import { CommonActions } from '@react-navigation/native';
import { useEffect, type RefObject } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { resolvePostAuthRoute } from '../services/onboarding/resolvePostAuthRoute';
import type { User } from 'firebase/auth';

const AUTH_ENTRY_SCREENS = new Set<keyof RootStackParamList>(['Welcome', 'SignIn', 'SignUp']);

function resetToRoute(
  nav: NavigationContainerRef<RootStackParamList>,
  name: keyof RootStackParamList,
) {
  nav.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name }],
    }),
  );
}

/** Route authenticated users off auth entry screens (Welcome, SignIn, SignUp). */
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
    if (!route || !AUTH_ENTRY_SCREENS.has(route)) return;

    void resolvePostAuthRoute(user.uid).then((target) => {
      if (!nav.isReady()) return;
      const current = nav.getRootState()?.routes[nav.getRootState().index]?.name;
      if (!current || !AUTH_ENTRY_SCREENS.has(current)) return;

      if (__DEV__) {
        console.log('[auth] sync route:', current, '→', target);
      }
      resetToRoute(nav, target);
    });
  }, [navigationReady, navigationRef, sessionReady, user?.uid]);
}
