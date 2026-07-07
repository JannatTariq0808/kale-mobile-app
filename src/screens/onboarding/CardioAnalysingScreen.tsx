// Design: kale-mobile-design — lum-02a KaleCardioLoaderLumen (screens/KaleLumenResults.jsx)

import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { ResultLoaderRing } from '../../components/lumen/ResultLoaderRing';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import { bodyTextStyle, headlineTextStyle } from '../../theme/textMetrics';
import { clearFirstTimeLogin } from '../../services/user/userProfile';
import { waitForCardioAssessmentReady } from '../../services/cardio/waitForCardioAssessment';
import { linkCardioToActiveAssessment } from '../../services/assessment/assessmentSession';
import { lumen } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CardioAnalysing'>;

export function CardioAnalysingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const headlineSize = 28;
  const subheadSize = 14;

  useEffect(() => {
    if (!user?.uid) return;

    let cancelled = false;
    const uid = user.uid;

    void (async () => {
      await waitForCardioAssessmentReady(uid);

      if (cancelled) return;

      await linkCardioToActiveAssessment(uid);

      if (cancelled) return;

      await clearFirstTimeLogin(uid);
      if (__DEV__) {
        console.log('[auth] first_time_login cleared for', uid);
      }

      if (!cancelled) {
        navigation.replace('CardioResult');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigation, user?.uid]);

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <View style={styles.center}>
          <ResultLoaderRing />

          <Text
            style={[
              styles.headline,
              headlineTextStyle(headlineSize, lumen.fg),
              { marginTop: 42, marginBottom: 10, letterSpacing: -0.7, textAlign: 'center' },
            ]}
          >
            Analysing your run…
          </Text>
          <Text
            style={[
              styles.subhead,
              bodyTextStyle(subheadSize, lumen.fgMuted),
              { textAlign: 'center' },
            ]}
          >
            Reviewing your best qualifying run and estimating VO₂max.
          </Text>
        </View>

        <View style={styles.footer}>
          <LumEyebrow pillar="cardio" label="Cardio" step="Analysing" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  content: {
    flex: 1,
    zIndex: 2,
    overflow: 'visible',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    overflow: 'visible',
  },
  headline: {
    maxWidth: 300,
  },
  subhead: {
    maxWidth: 280,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 26,
    alignItems: 'center',
  },
});
