// Design: kale-mobile-design — lum-08 KaleKnowledgeResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LumenResultView, type LumenResultConfig } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';
import { useAuthSession } from '../../hooks/useAuthSession';
import {
  fetchAssessmentsForUser,
  fetchPreviousPillarLevelFromAssessments,
  finalizeActiveAssessmentIfReady,
  linkKnowledgeToOnboardingAssessment,
} from '../../services/assessment/assessmentSession';
import { resolveOnboardingResumeRoute, resolveResultNextButtonLabel } from '../../services/onboarding/resolveOnboardingNavigation';
import { invalidateHomeLongevityData } from '../../hooks/useHomeLongevityData';
import { invalidateFitnessPillarData } from '../../hooks/useFitnessPillarData';
import { fetchKnowledgeAssessmentById } from '../../services/knowledge/knowledgeAssessmentSession';
import { buildKnowledgeResultConfig } from '../../utils/knowledgeLevel';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeResult'>;

export function KnowledgeResultScreen({ navigation, route }: Props) {
  const { user } = useAuthSession();
  const { assessmentId, totalQuestions, meta } = route.params;
  const [config, setConfig] = useState<LumenResultConfig | null>(null);
  const [nextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const assessment = await fetchKnowledgeAssessmentById(assessmentId);
      if (cancelled || !assessment) return;

      const { assessments } = user?.uid
        ? await fetchAssessmentsForUser(user.uid)
        : { assessments: [] };
      const currentAssessment = assessments.find((item) => item.knowledge_id === assessmentId);

      const previousLevel = user?.uid
        ? await fetchPreviousPillarLevelFromAssessments(user.uid, 'knowledge', {
            pillarRefId: assessmentId,
            assessmentId: currentAssessment?.id,
          })
        : null;

      const nextBtn = user?.uid
        ? await resolveResultNextButtonLabel(user.uid, 'knowledge', assessmentId)
        : 'See your Longevity Level';

      if (cancelled) return;

      setConfig(
        buildKnowledgeResultConfig({
          correctCount: assessment.correct_responses,
          totalQuestions,
          meta,
          previousLevel,
          nextBtn,
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [assessmentId, meta, totalQuestions, user?.uid]);

  if (!config) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  const handleNext = () => {
    if (nextLoading) return;
    void (async () => {
      setNextLoading(true);
      try {
        if (user?.uid) {
          await linkKnowledgeToOnboardingAssessment(user.uid, assessmentId);
          await finalizeActiveAssessmentIfReady(user.uid);
          invalidateHomeLongevityData(user.uid);
          invalidateFitnessPillarData(user.uid);

          const next = await resolveOnboardingResumeRoute(user.uid, {
            justCompleted: 'knowledge',
            pillarRefId: assessmentId,
          });
          navigation.replace(
            next as 'KnowledgeIntro' | 'StrengthIntro' | 'LevelReveal' | 'Main',
          );
          return;
        }
        navigation.replace('LevelReveal');
      } catch {
        setNextLoading(false);
      }
    })();
  };

  return (
    <LumenResultView
      config={config}
      showBackButton={false}
      nextLoading={nextLoading}
      onNext={handleNext}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
