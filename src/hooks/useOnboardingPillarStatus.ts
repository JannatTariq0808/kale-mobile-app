import { useEffect, useState } from 'react';
import {
  canSkipOnboardingPillar,
  fetchOnboardingPillarStatus,
  type OnboardingPillarStatus,
} from '../services/onboarding/onboardingPillarStatus';

export function useOnboardingPillarStatus(uid: string | null | undefined) {
  const [status, setStatus] = useState<OnboardingPillarStatus | null>(null);
  const [loading, setLoading] = useState(Boolean(uid));

  useEffect(() => {
    if (!uid) {
      setStatus(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchOnboardingPillarStatus(uid)
      .then((value) => {
        if (!cancelled) setStatus(value);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return {
    status,
    loading,
    canSkipStrength: status ? canSkipOnboardingPillar('strength', status) : false,
    canSkipKnowledge: status ? canSkipOnboardingPillar('knowledge', status) : false,
  };
}
