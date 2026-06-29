import type { NavigationProp } from '@react-navigation/native';
import type { KnowledgeAssessmentMeta } from '../types/questionSet';
import type { RootStackParamList } from './types';

export type KnowledgeFlowParams = {
  assessmentId: string;
  setId: string;
  totalQuestions: number;
  meta: KnowledgeAssessmentMeta;
};

type RootNavigation = NavigationProp<RootStackParamList>;

/** Clears earlier onboarding screens (e.g. StrengthResult) from the stack. */
export function resetToKnowledgeAnalysing(
  navigation: RootNavigation,
  params: KnowledgeFlowParams,
): void {
  navigation.reset({
    index: 0,
    routes: [{ name: 'KnowledgeAnalysing', params }],
  });
}

export function resetToKnowledgeResult(
  navigation: RootNavigation,
  params: KnowledgeFlowParams,
): void {
  navigation.reset({
    index: 0,
    routes: [{ name: 'KnowledgeResult', params }],
  });
}
