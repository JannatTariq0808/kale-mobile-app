// Design: kale-mobile-design — lum-08 KaleKnowledgeResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LumenResultView, type LumenResultConfig } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';
import { useAuthSession } from '../../hooks/useAuthSession';
import {
  fetchKnowledgeAssessmentById,
  fetchPreviousCompletedKnowledgeLevel,
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

      const previousLevel = user?.uid
        ? await fetchPreviousCompletedKnowledgeLevel(user.uid, assessmentId)
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

  return (
    <LumenResultView
      config={config}
      onBack={() => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return;
        }
        navigation.replace('LevelReveal');
      }}
      onNext={() => navigation.replace('LevelReveal')}
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
