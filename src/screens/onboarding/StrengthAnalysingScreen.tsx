// Design: kale-mobile-design — lum-04 KaleStrengthLoaderLumen (screens/KaleLumenResults.jsx)

import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { ResultLoaderRing } from '../../components/lumen/ResultLoaderRing';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora } from '../../theme';

/** Simulated AI review — swap for GPT / Claude / Gemini when backend is ready */
const ANALYSIS_DURATION_MS = 4500;

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthAnalysing'>;

export function StrengthAnalysingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { videoUri } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      // TODO: StrengthResult when built — pass videoUri to AI pipeline first
      navigation.replace('StrengthResult');
    }, ANALYSIS_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation, videoUri]);

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

          <Text style={styles.headline}>Analysing your plank…</Text>
          <Text style={styles.subhead}>
            Reviewing your video and logging your hold time. Usually under a minute.
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
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  headline: {
    ...sora('extrabold'),
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.7,
    color: lumen.fg,
    textAlign: 'center',
    marginTop: 42,
    marginBottom: 10,
  },
  subhead: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 22,
    color: lumen.fgMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 26,
    alignItems: 'center',
  },
});
