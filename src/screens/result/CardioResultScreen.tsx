// Design: kale-mobile-design — lum-02 KaleCardioResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LumenResultView, type LumenResultConfig } from '../../components/lumen/LumenResultView';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import { fetchCardioSummary } from '../../services/cardio/fetchCardioSummary';
import { fetchHealthProfileForAssess } from '../../services/user/fetchHealthProfile';
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
  resultUnit: 'ml/kg·min',
  resultLabel: 'Estimated VO₂max — your strongest longevity signal.',
  tiles: [
    { label: 'Best pace', value: '—', unit: '/km' },
    { label: 'Best run', value: '—' },
    { label: 'Device', value: 'Tracker' },
  ],
  nextLevel: 2,
  nextActions: [
    'Connect Strava or Garmin with a qualifying activity',
    'Sync a run over 3 km or a ride with power data',
    'Re-open the app after your tracker syncs',
  ],
  nextBtn: 'Next — Strength',
};

export function CardioResultScreen({ navigation }: Props) {
  const { user } = useAuthSession();
  const [config, setConfig] = useState<LumenResultConfig | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (!user?.uid) return;

      const [summary, profile] = await Promise.all([
        fetchCardioSummary(user.uid),
        fetchHealthProfileForAssess(),
      ]);

      if (cancelled) return;

      if (!summary || !profile || summary.level <= 0) {
        setConfig(FALLBACK_CONFIG);
        return;
      }

      setConfig(
        buildCardioResultConfig({
          summary,
          profile,
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
      onBack={() => navigation.goBack()}
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
