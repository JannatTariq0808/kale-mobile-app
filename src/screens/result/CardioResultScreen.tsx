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
} from '../../services/assessment/assessmentSession';
import { fetchCardioSummary } from '../../services/cardio/fetchCardioSummary';
import { fetchHealthProfileForAssess } from '../../services/user/fetchHealthProfile';
import { clearFirstTimeLogin } from '../../services/user/userProfile';
import { buildCardioResultConfig } from '../../utils/buildCardioResultConfig';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CardioResult'>;

const FALLBACK_CONFIG: LumenResultConfig = {
  pillar: 'cardio',
  pillarLabel: 'Cardio',
  level: 1,
  trend: 'none',
  levelNote: 'We could not load your cardio assessment yet.',
  percentile: 35,
  rpText: 'Complete a qualifying run or ride to see your cohort ranking.',
  resultHero: '—',
  resultUnit: 'min/km',
  resultLabel: '',
  tiles: [
    { label: 'Best run', value: '—', unit: 'km' },
    { label: 'Avg HR', value: '—', unit: 'bpm' },
  ],
  nextLevel: 2,
  nextActions: [],
  levelUpMessage:
    'Connect Strava or Garmin and sync a qualifying run or ride to see your level-up target.',
  nextBtn: 'Next — Strength',
};

export function CardioResultScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const [config, setConfig] = useState<LumenResultConfig | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    void clearFirstTimeLogin(user.uid);
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
      const previousLevel = await fetchPreviousPillarLevelFromAssessments(user.uid, 'cardio', {
        assessmentId: currentAssessment?.id,
      });

      if (cancelled) return;

      setConfig(
        buildCardioResultConfig({
          summary,
          profile,
          previousLevel,
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
      onNext={() => navigation.navigate('StrengthIntro')}
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
