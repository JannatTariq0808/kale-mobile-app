import type { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../config/firebase';
import { getFirebaseAuth, onAuthStateChanged } from '../services/auth';

export type AuthSession = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const PERSISTENCE_RECHECK_MS = 400;

/**
 * Restores the signed-in session on cold start (AsyncStorage via Firebase Auth).
 */
export function useAuthSession(): AuthSession {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const auth = getFirebaseAuth();
    let bootstrapped = false;
    let recheckTimer: ReturnType<typeof setTimeout> | undefined;

    const finishBootstrap = (nextUser: User | null) => {
      if (bootstrapped) return;
      bootstrapped = true;
      setUser(nextUser);
      setIsLoading(false);
      if (__DEV__) {
        console.log('[auth] session restored:', nextUser?.email ?? 'signed out');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);

      if (bootstrapped) return;

      if (nextUser) {
        finishBootstrap(nextUser);
        return;
      }

      // Expo Go / RN: first callback can be null before AsyncStorage hydration finishes.
      recheckTimer = setTimeout(() => {
        finishBootstrap(auth.currentUser);
      }, PERSISTENCE_RECHECK_MS);
    });

    return () => {
      if (recheckTimer) clearTimeout(recheckTimer);
      unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user != null,
  };
}
