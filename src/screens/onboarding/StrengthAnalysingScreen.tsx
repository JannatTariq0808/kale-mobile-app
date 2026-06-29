// Design: kale-mobile-design — lum-04 KaleStrengthLoaderLumen (screens/KaleLumenResults.jsx)

import { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { ResultLoaderRing } from '../../components/lumen/ResultLoaderRing';
import { useAuthSession } from '../../hooks/useAuthSession';
import type { RootStackParamList } from '../../navigation/types';
import { analyzePlankRecording } from '../../services/strength/analyzePlankRecording';
import { saveStrengthAssessment } from '../../services/strength/strengthAssessmentSession';
import { bodyTextStyle, headlineTextStyle } from '../../theme/textMetrics';
import { calculateStrengthLevelFromPlankHold } from '../../utils/strengthLevel';
import { lumen } from '../../theme';

const MIN_DISPLAY_MS = 2500;

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthAnalysing'>;

export function StrengthAnalysingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { videoUri, recordedDurationSec, poseStats } = route.params;
  const headlineSize = 28;
  const subheadSize = 14;
  const [statusLine, setStatusLine] = useState('Reviewing your recording…');

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    void (async () => {
      setStatusLine('Measuring hold time…');
      const analysis = await analyzePlankRecording({
        videoUri,
        recordedDurationSec,
        poseStats,
      });
      if (cancelled) return;

      const elapsed_time = analysis.holdDurationSec;
      const level = calculateStrengthLevelFromPlankHold(elapsed_time);

      let strengthAssessmentId: string | undefined;
      if (user?.uid) {
        setStatusLine('Saving your result…');
        const savedId = await saveStrengthAssessment(user.uid, {
          elapsed_time,
          level,
          is_completed: true,
        });
        if (savedId) strengthAssessmentId = savedId;
        else if (__DEV__) {
          console.warn('[strength] Firestore save failed — check rules for strength collection');
        }
      }

      const elapsed = Date.now() - startedAt;
      const waitMs = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        if (cancelled) return;
        navigation.replace('StrengthResult', {
          analysis,
          videoUri,
          strengthAssessmentId,
          elapsed_time,
          level,
        });
      }, waitMs);
    })();

    return () => {
      cancelled = true;
    };
  }, [navigation, poseStats, recordedDurationSec, user?.uid, videoUri]);

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
            Analysing your plank…
          </Text>
          <Text
            style={[
              styles.subhead,
              bodyTextStyle(subheadSize, lumen.fgMuted),
              { textAlign: 'center' },
            ]}
          >
            {statusLine} Pose detection will refine this automatically in a future update.
          </Text>
        </View>

        <View style={styles.footer}>
          <LumEyebrow pillar="strength" label="Strength" step="Analysing" />
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
