import { useMemo } from 'react';
import { useAppNow } from './useAppNow';
import { getAssessmentCycle, type AssessmentCycle } from '../utils/assessmentCycle';

export function useAssessmentCycle(): AssessmentCycle {
  const now = useAppNow(false);
  return useMemo(
    () => getAssessmentCycle(now),
    [now.getFullYear(), now.getMonth(), now.getDate()],
  );
}
