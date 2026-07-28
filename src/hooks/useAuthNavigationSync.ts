import { CommonActions } from '@react-navigation/native';
import { useEffect, type RefObject } from 'react';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { resolvePostAuthRoute } from '../services/onboarding/resolvePostAuthRoute';
import { getFirebaseAuth } from '../services/auth/index';
import { setAuthNotice } from '../services/auth/authNotice';
import { signOutUser } from '../services/auth/session';
import {
  fetchUserProfile,
  POLICY_HOLDER_REQUIRED_MESSAGE,
  ProfileFetchError,
} from '../services/user/userProfile';
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

    const uid = user.uid;
    let cancelled = false;

    void (async () => {
      try {
        const profile = await fetchUserProfile(uid);
        if (cancelled) return;
        // Logout can finish while this request was in flight — never redirect a guest.
        if (getFirebaseAuth().currentUser?.uid !== uid) return;
        if (!nav.isReady()) return;

        const current = nav.getRootState()?.routes[nav.getRootState().index]?.name;
        if (!current || !AUTH_ENTRY_SCREENS.has(current)) return;

        if (!profile.policyHolder) {
          await setAuthNotice(POLICY_HOLDER_REQUIRED_MESSAGE);
          await signOutUser();
          return;
        }

        const target = await resolvePostAuthRoute(uid, profile);
        if (cancelled) return;
        if (getFirebaseAuth().currentUser?.uid !== uid) return;
        if (!nav.isReady()) return;

        const latest = nav.getRootState()?.routes[nav.getRootState().index]?.name;
        if (!latest || !AUTH_ENTRY_SCREENS.has(latest)) return;

        if (__DEV__) {
          console.log('[auth] sync route:', current, '→', target);
        }
        resetToRoute(nav, target);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof ProfileFetchError && error.reason === 'offline') {
          if (__DEV__) {
            console.log('[auth] Firestore offline — skipping auth navigation sync');
          }
          return;
        }
        if (__DEV__) {
          console.warn('[auth] auth navigation sync failed', error);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigationReady, navigationRef, sessionReady, user?.uid]);
}
