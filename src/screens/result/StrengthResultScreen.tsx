// Design: kale-mobile-design — lum-05 KaleStrengthResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LumenResultView, type LumenResultConfig } from '../../components/lumen/LumenResultView';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import {
  fetchAssessmentsForUser,
  fetchPreviousPillarLevelFromAssessments,
  finalizeActiveAssessmentIfReady,
  linkStrengthToOnboardingAssessment,
} from '../../services/assessment/assessmentSession';
import { resolveOnboardingResumeRoute, resolveResultNextButtonLabel } from '../../services/onboarding/resolveOnboardingNavigation';
import { invalidateHomeLongevityData } from '../../hooks/useHomeLongevityData';
import { invalidateFitnessPillarData } from '../../hooks/useFitnessPillarData';
import { fetchStrengthAssessmentById } from '../../services/strength/strengthAssessmentSession';
import { fetchDemographicsForAssess } from '../../services/user/fetchHealthProfile';
import type { PlankAnalysisResult } from '../../types/plankRecording';
import { buildStrengthResultConfig } from '../../utils/buildStrengthResultConfig';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthResult'>;

const FALLBACK_ANALYSIS: PlankAnalysisResult = {
  holdDurationSec: 0,
  confidence: 1,
  source: 'recording_timer',
  formNotes: ['Loaded from your saved strength assessment.'],
};

export function StrengthResultScreen({ navigation, route }: Props) {
  const { user } = useAuthSession();
  const { analysis: routeAnalysis, elapsed_time: routeElapsed, strengthAssessmentId } =
    route.params;
  const [config, setConfig] = useState<LumenResultConfig | null>(null);
  const [nextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      let elapsed_time = routeElapsed;
      let analysis: PlankAnalysisResult = routeAnalysis ?? FALLBACK_ANALYSIS;

      if (strengthAssessmentId) {
        const saved = await fetchStrengthAssessmentById(strengthAssessmentId);
        if (cancelled) return;

        if (saved?.is_completed) {
          elapsed_time = saved.elapsed_time;
          analysis = {
            ...analysis,
            holdDurationSec: saved.elapsed_time,
            source: 'recording_timer',
            formNotes: ['Loaded from your saved strength assessment.'],
          };
          if (__DEV__) {
            console.log('[strength] result loaded from Firestore', strengthAssessmentId, saved);
          }
        }
      }

      const profile = await fetchDemographicsForAssess();
      if (cancelled) return;

      const { assessments } = user?.uid
        ? await fetchAssessmentsForUser(user.uid)
        : { assessments: [] };
      const currentAssessment = strengthAssessmentId
        ? assessments.find((item) => item.strength_id === strengthAssessmentId)
        : assessments.find((item) => item.strength_id);

      const previousLevel =
        user?.uid
          ? await fetchPreviousPillarLevelFromAssessments(user.uid, 'strength', {
              pillarRefId: strengthAssessmentId,
              assessmentId: currentAssessment?.id,
            })
          : null;

      const nextBtn = user?.uid
        ? await resolveResultNextButtonLabel(user.uid, 'strength', strengthAssessmentId)
        : 'Next — Knowledge';

      if (cancelled) return;

      setConfig(
        buildStrengthResultConfig({
          elapsed_time,
          analysis,
          profile,
          previousLevel,
          nextBtn,
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [routeAnalysis, routeElapsed, strengthAssessmentId, user?.uid]);

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
          if (strengthAssessmentId) {
            await linkStrengthToOnboardingAssessment(user.uid, strengthAssessmentId);
          }
          await finalizeActiveAssessmentIfReady(user.uid);
          invalidateHomeLongevityData(user.uid);
          invalidateFitnessPillarData(user.uid);

          const next = await resolveOnboardingResumeRoute(user.uid, {
            justCompleted: 'strength',
            pillarRefId: strengthAssessmentId,
          });
          navigation.replace(next as 'KnowledgeIntro' | 'StrengthIntro' | 'LevelReveal' | 'Main');
          return;
        }
        navigation.navigate('KnowledgeIntro');
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
