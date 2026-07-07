import { useEffect, useState } from 'react';
import type { RootStackParamList } from '../navigation/types';
import { signOutUser } from '../services/auth/session';
import { resolvePostAuthRoute } from '../services/onboarding/resolvePostAuthRoute';
import { fetchUserProfile } from '../services/user/userProfile';
import type { User } from 'firebase/auth';

type InitialAuthRoute = keyof RootStackParamList | null;

/**
 * Where authenticated users should land: CardioAnalysing (first login),
 * StrengthIntro / KnowledgeIntro / LevelReveal (onboarding resume), or Main.
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
      const profile = await fetchUserProfile(user.uid);
      if (cancelled) return;

      if (!profile.policyHolder) {
        if (__DEV__) {
          console.log('[auth] not a policy holder — signing out');
        }
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
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionReady, user?.uid]);

  return route;
}
