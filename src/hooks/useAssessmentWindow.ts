import { useMemo } from 'react';
import { useAppNow } from './useAppNow';
import { getAssessmentWindow, type AssessmentWindow } from '../utils/assessmentCycle';

export function useAssessmentWindow(): AssessmentWindow {
  const now = useAppNow(true);
  return useMemo(() => getAssessmentWindow(now), [now.getTime()]);
}
