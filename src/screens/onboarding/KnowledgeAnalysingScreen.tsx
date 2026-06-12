// Design: kale-mobile-design — KaleKnowledgeLoaderLumen (screens/KaleLumenResults.jsx)

import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { ResultLoaderRing } from '../../components/lumen/ResultLoaderRing';
import type { RootStackParamList } from '../../navigation/types';
import { bodyTextStyle, headlineTextStyle } from '../../theme/textMetrics';
import { lumen } from '../../theme';

const ANALYSIS_DURATION_MS = 4500;

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeAnalysing'>;

export function KnowledgeAnalysingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const headlineSize = 28;
  const subheadSize = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('KnowledgeResult');
    }, ANALYSIS_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

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
              { marginTop: 28, letterSpacing: -0.84, textAlign: 'center' },
            ]}
          >
            Scoring your answers…
          </Text>
          <Text
            style={[
              styles.subhead,
              bodyTextStyle(subheadSize, lumen.fgMuted),
              { marginTop: 12, textAlign: 'center' },
            ]}
          >
            Scoring your quiz across all five topics.
          </Text>
        </View>
        <View style={styles.footer}>
          <LumEyebrow pillar="knowledge" label="Knowledge" step="Analysing" />
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
    paddingHorizontal: 32,
    overflow: 'visible',
  },
  headline: {
    maxWidth: 300,
  },
  subhead: {
    maxWidth: 280,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});
