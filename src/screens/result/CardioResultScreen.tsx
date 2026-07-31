// Design: kale-mobile-design — lum-02 KaleCardioResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LumenResultView, type LumenResultConfig } from '../../components/lumen/LumenResultView';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import {
  fetchActiveInProgressAssessment,
  fetchAssessmentsForUser,
  fetchPreviousPillarLevelFromAssessments,
  finalizeActiveAssessmentIfReady,
} from '../../services/assessment/assessmentSession';
import { resolveOnboardingResumeRoute, resolveResultNextButtonLabel } from '../../services/onboarding/resolveOnboardingNavigation';
import { invalidateHomeLongevityData } from '../../hooks/useHomeLongevityData';
import { invalidateFitnessPillarData } from '../../hooks/useFitnessPillarData';
import { fetchCardioSummary } from '../../services/cardio/fetchCardioSummary';
import { fetchHealthProfileForAssess } from '../../services/user/fetchHealthProfile';
import { clearFirstTimeLogin } from '../../services/user/userProfile';
import { markCardioResultSeen } from '../../services/onboarding/onboardingState';
import {
  buildBaselineCardioResultConfig,
  buildCardioResultConfig,
  isBaselineCardioSummary,
} from '../../utils/buildCardioResultConfig';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CardioResult'>;

const FALLBACK_CONFIG = buildBaselineCardioResultConfig({
  level: 1,
  nextBtn: 'Next — Strength',
});

export function CardioResultScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const [config, setConfig] = useState<LumenResultConfig | null>(null);
  const [nextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    void clearFirstTimeLogin(user.uid);
    void markCardioResultSeen(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!user?.uid) return;

      const [{ assessments }, summary, profile, activeAssessment] = await Promise.all([
        fetchAssessmentsForUser(user.uid),
        fetchCardioSummary(user.uid),
        fetchHealthProfileForAssess(),
        fetchActiveInProgressAssessment(user.uid),
      ]);

      if (cancelled) return;

      if (!summary || !profile || summary.level <= 0) {
        setConfig(FALLBACK_CONFIG);
        return;
      }

      const currentAssessment =
        activeAssessment ??
        assessments.find((item) => item.cardio_id && !item.is_completed) ??
        assessments.find((item) => item.cardio_id);

      const nextBtn = await resolveResultNextButtonLabel(
        user.uid,
        'cardio',
        currentAssessment?.cardio_id,
      );

      if (cancelled) return;

      if (isBaselineCardioSummary(summary)) {
        setConfig(buildBaselineCardioResultConfig({ level: summary.level || 1, nextBtn }));
        return;
      }

      const previousLevel = await fetchPreviousPillarLevelFromAssessments(user.uid, 'cardio', {
        assessmentId: currentAssessment?.id,
      });

      if (cancelled) return;

      setConfig(
        buildCardioResultConfig({
          summary,
          profile,
          previousLevel,
          nextBtn,
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (!config) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  return (
    <LumenResultView
      config={config}
      showBackButton={false}
      nextLoading={nextLoading}
      onNext={() => {
        if (nextLoading) return;
        void (async () => {
          setNextLoading(true);
          try {
            if (user?.uid) {
              await finalizeActiveAssessmentIfReady(user.uid);
              invalidateHomeLongevityData(user.uid);
              invalidateFitnessPillarData(user.uid);

              const next = await resolveOnboardingResumeRoute(user.uid, {
                justCompleted: 'cardio',
              });
              navigation.replace(
                next as 'KnowledgeIntro' | 'StrengthIntro' | 'LevelReveal' | 'Main',
              );
              return;
            }
            navigation.navigate('StrengthIntro');
          } catch {
            setNextLoading(false);
          }
        })();
      }}
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
