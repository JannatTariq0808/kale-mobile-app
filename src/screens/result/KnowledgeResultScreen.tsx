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
} from '../../services/assessment/assessmentSession';
import { resolveOnboardingResumeRoute } from '../../services/onboarding/resolveOnboardingNavigation';
import {
  clearActiveAssessmentFlow,
  isQuarterlyAssessmentFlow,
} from '../../services/assessment/assessmentFlowSession';
import {
  finalizeActiveAssessmentIfReady,
  linkKnowledgeToOnboardingAssessment,
} from '../../services/assessment/assessmentSession';
import {
  fetchKnowledgeAssessmentById,
} from '../../services/knowledge/knowledgeAssessmentSession';
import { buildKnowledgeResultConfig } from '../../utils/knowledgeLevel';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeResult'>;

export function KnowledgeResultScreen({ navigation, route }: Props) {
  const { user } = useAuthSession();
  const { assessmentId, totalQuestions, meta } = route.params;
  const [config, setConfig] = useState<LumenResultConfig | null>(null);

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

      if (cancelled) return;

      setConfig(
        buildKnowledgeResultConfig({
          correctCount: assessment.correct_responses,
          totalQuestions,
          meta,
          previousLevel,
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
    void (async () => {
      if (isQuarterlyAssessmentFlow()) {
        if (user?.uid) {
          await linkKnowledgeToOnboardingAssessment(user.uid, assessmentId);
          await finalizeActiveAssessmentIfReady(user.uid);
        }
        clearActiveAssessmentFlow();
        navigation.replace('Main');
        return;
      }

      if (user?.uid) {
        const next = await resolveOnboardingResumeRoute(user.uid);
        navigation.replace(next as 'KnowledgeIntro' | 'StrengthIntro' | 'LevelReveal' | 'Main');
        return;
      }
      navigation.replace('LevelReveal');
    })();
  };

  return (
    <LumenResultView
      config={config}
      showBackButton={false}
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
