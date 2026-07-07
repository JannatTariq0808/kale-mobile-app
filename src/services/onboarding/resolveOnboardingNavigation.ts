import type { RootStackParamList } from '../../navigation/types';
import {
  fetchInProgressOnboardingAssessment,
  resolveOnboardingPillarStep,
  type OnboardingPillarStep,
} from '../assessment/assessmentSession';
import { fetchAssessmentReadyForReveal } from './onboardingPillarStatus';
import { isOnboardingCompleteForUser } from './onboardingState';

export function onboardingPillarStepToRoute(
  step: OnboardingPillarStep,
): keyof RootStackParamList {
  switch (step) {
    case 'cardio':
      return 'ConnectTracker';
    case 'strength':
      return 'StrengthIntro';
    case 'knowledge':
      return 'KnowledgeIntro';
    case 'reveal':
      return 'LevelReveal';
    case 'done':
      return 'Main';
    default:
      return 'Main';
  }
}

/** Next screen after completing or resuming an in-progress onboarding assessment. */
export async function resolveOnboardingResumeRoute(
  uid: string,
): Promise<keyof RootStackParamList> {
  const inProgress = await fetchInProgressOnboardingAssessment(uid);
  if (inProgress) {
    const step = await resolveOnboardingPillarStep(inProgress);
    return onboardingPillarStepToRoute(step);
  }

  const ready = await fetchAssessmentReadyForReveal(uid);
  if (ready?.is_completed && !(await isOnboardingCompleteForUser(uid))) {
    return 'LevelReveal';
  }

  return 'Main';
}

export async function hasInProgressOnboardingAssessment(uid: string): Promise<boolean> {
  const assessment = await fetchInProgressOnboardingAssessment(uid);
  return assessment != null;
}

/** Onboarding skip loop: strength ↔ knowledge (cardio is required once). */
export function onboardingSkipTarget(
  from: 'strength' | 'knowledge',
): 'StrengthIntro' | 'KnowledgeIntro' {
  return from === 'strength' ? 'KnowledgeIntro' : 'StrengthIntro';
}
