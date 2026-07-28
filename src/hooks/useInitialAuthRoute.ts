import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../navigation/types';
import { setAuthNotice } from '../services/auth/authNotice';
import { signOutUser } from '../services/auth/session';
import { resolvePostAuthRoute } from '../services/onboarding/resolvePostAuthRoute';
import {
  fetchUserProfile,
  POLICY_HOLDER_REQUIRED_MESSAGE,
  ProfileFetchError,
} from '../services/user/userProfile';
import type { User } from 'firebase/auth';

type InitialAuthRoute = keyof RootStackParamList | null;

const OFFLINE_RETRY_MS = 2000;

/**
 * Where authenticated users should land: ConnectTracker (no cardio yet),
 * CardioAnalysing (cardio in flight), StrengthIntro / KnowledgeIntro / LevelReveal
 * (onboarding resume), or Main.
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

    void (async () => {
      while (!cancelled) {
        try {
          const profile = await fetchUserProfile(user.uid);
          if (cancelled) return;

          if (!profile.policyHolder) {
            if (__DEV__) {
              console.log('[auth] not a policy holder — signing out');
            }
            await setAuthNotice(POLICY_HOLDER_REQUIRED_MESSAGE);
            await signOutUser();
            return;
          }

          const next = await resolvePostAuthRoute(user.uid, profile);
          if (cancelled) return;
          if (__DEV__) {
            console.log('[auth] initial route:', next, {
              firstTimeLogin: profile.firstTimeLogin,
            });
          }
          setRoute(next);
          return;
        } catch (error) {
          if (cancelled) return;
          if (error instanceof ProfileFetchError && error.reason === 'offline') {
            if (__DEV__) {
              console.log('[auth] Firestore offline — retrying profile fetch');
            }
            await new Promise((resolve) => setTimeout(resolve, OFFLINE_RETRY_MS));
            continue;
          }
          if (__DEV__) {
            console.warn('[auth] profile fetch failed — retrying', error);
          }
          await new Promise((resolve) => setTimeout(resolve, OFFLINE_RETRY_MS));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionReady, user?.uid]);

  return route;
}
