// Design: kale-mobile-design — KaleKnowledgeLoaderLumen (screens/KaleLumenResults.jsx)

import { useEffect } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LumEyebrow } from '../../components/lumen/LumEyebrow';
import { ResultLoaderRing } from '../../components/lumen/ResultLoaderRing';
import type { RootStackParamList } from '../../navigation/types';
import { lumen, sora } from '../../theme';

const ANALYSIS_DURATION_MS = 4500;

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeAnalysing'>;

export function KnowledgeAnalysingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.headline}>Scoring your answers…</Text>
          <Text style={styles.subhead}>
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
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  headline: {
    ...sora('extrabold'),
    marginTop: 28,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.84,
    color: lumen.fg,
    textAlign: 'center',
  },
  subhead: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22.5,
    color: lumen.fgMuted,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
});
