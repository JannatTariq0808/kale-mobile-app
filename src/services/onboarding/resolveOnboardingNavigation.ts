import type { RootStackParamList } from '../../navigation/types';
import type { KaleAssessment } from '../../types/assessment';
import {
  fetchActiveInProgressAssessment,
  fetchInProgressOnboardingAssessment,
  fetchInProgressQuarterlyAssessment,
  isKnowledgeCompleted,
  isStrengthCompleted,
  resolveOnboardingPillarStep,
  type AssessmentPillar,
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
      return 'LevelReveal';
    default:
      return 'Main';
  }
}

/** CTA copy on pillar result screens — based on what the open assessment still needs. */
export function resultNextButtonLabel(step: OnboardingPillarStep): string {
  switch (step) {
    case 'cardio':
      return 'Next — Cardio';
    case 'strength':
      return 'Next — Strength';
    case 'knowledge':
      return 'Next — Knowledge';
    case 'reveal':
    case 'done':
      return 'See your Longevity Level';
    default:
      return 'Continue';
  }
}

/**
 * Next step after finishing a pillar on the active assessment.
 * Treats `justCompleted` as done even if the parent ref write is still catching up.
 */
export async function resolveNextStepAfterPillar(
  uid: string,
  justCompleted: AssessmentPillar,
  pillarRefId?: string | null,
): Promise<OnboardingPillarStep> {
  const assessment =
    (await fetchActiveInProgressAssessment(uid)) ??
    (await fetchAssessmentReadyForReveal(uid));

  if (!assessment) {
    if (justCompleted === 'cardio') return 'strength';
    if (justCompleted === 'strength') return 'knowledge';
    return 'reveal';
  }

  return resolveStepAssumingPillarComplete(assessment, justCompleted, pillarRefId);
}

async function resolveStepAssumingPillarComplete(
  assessment: KaleAssessment,
  justCompleted: AssessmentPillar,
  pillarRefId?: string | null,
): Promise<OnboardingPillarStep> {
  const cardioId =
    justCompleted === 'cardio'
      ? pillarRefId ?? assessment.cardio_id
      : assessment.cardio_id;
  if (!cardioId) return 'cardio';

  const strengthId =
    justCompleted === 'strength'
      ? pillarRefId ?? assessment.strength_id
      : assessment.strength_id;
  const strengthComplete =
    justCompleted === 'strength' ||
    (Boolean(strengthId) && (await isStrengthCompleted(strengthId!)));
  if (!strengthComplete) return 'strength';

  const knowledgeId =
    justCompleted === 'knowledge'
      ? pillarRefId ?? assessment.knowledge_id
      : assessment.knowledge_id;
  const knowledgeComplete =
    justCompleted === 'knowledge' ||
    (Boolean(knowledgeId) && (await isKnowledgeCompleted(knowledgeId!)));
  if (!knowledgeComplete) return 'knowledge';

  return assessment.is_completed ? 'done' : 'reveal';
}

export async function resolveResultNextButtonLabel(
  uid: string,
  justCompleted: AssessmentPillar,
  pillarRefId?: string | null,
): Promise<string> {
  const step = await resolveNextStepAfterPillar(uid, justCompleted, pillarRefId);
  return resultNextButtonLabel(step);
}

/**
 * Next screen after completing a pillar (onboarding or quarterly).
 * When all pillars are done → LevelReveal (then HealthYears → FirstCycleRewards → Main).
 *
 * Pass `justCompleted` + `pillarRefId` from result screens so a slow assessment
 * `strength_id` / `knowledge_id` write cannot bounce the user back to that intro.
 */
export async function resolveOnboardingResumeRoute(
  uid: string,
  options?: {
    justCompleted?: AssessmentPillar;
    pillarRefId?: string | null;
  },
): Promise<keyof RootStackParamList> {
  if (options?.justCompleted) {
    const step = await resolveNextStepAfterPillar(
      uid,
      options.justCompleted,
      options.pillarRefId,
    );
    return onboardingPillarStepToRoute(step);
  }

  const inProgressOnboarding = await fetchInProgressOnboardingAssessment(uid);
  if (inProgressOnboarding) {
    const step = await resolveOnboardingPillarStep(inProgressOnboarding);
    return onboardingPillarStepToRoute(step);
  }

  const inProgressQuarterly = await fetchInProgressQuarterlyAssessment(uid);
  if (inProgressQuarterly) {
    const step = await resolveOnboardingPillarStep(inProgressQuarterly);
    return onboardingPillarStepToRoute(step);
  }

  const ready = await fetchAssessmentReadyForReveal(uid);
  if (ready) {
    const step = await resolveOnboardingPillarStep(ready);
    if (step === 'cardio' || step === 'strength' || step === 'knowledge') {
      return onboardingPillarStepToRoute(step);
    }
    // reveal or done — show LevelReveal ceremony (not Main yet)
    return 'LevelReveal';
  }

  if (await isOnboardingCompleteForUser(uid)) {
    return 'Main';
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
