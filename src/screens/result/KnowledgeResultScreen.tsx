// Design: kale-mobile-design — lum-08 KaleKnowledgeResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LumenResultView } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'KnowledgeResult'>;

export function KnowledgeResultScreen({ navigation }: Props) {
  return (
    <LumenResultView
      config={{
        pillar: 'knowledge',
        pillarLabel: 'Knowledge',
        level: 7,
        trend: 'down',
        trendDelta: -1,
        levelNote: 'Down from Level 8 last cycle.',
        percentile: 68,
        rpText: 'Ahead of 68% of Kale members.',
        resultHero: '16/20',
        resultLabel: 'Quiz score — General longevity.',
        tiles: [
          { label: 'Accuracy', value: '80', unit: '%' },
          { label: 'Strongest', value: 'Exercise', unit: 'science' },
          { label: 'Focus', value: 'Nutrition' },
        ],
        nextLevel: 8,
        nextActions: [
          'Score 18/20 next quarter',
          'Brush up on nutrition basics',
          'Read the weekly longevity briefs',
        ],
        nextBtn: 'See your Longevity Level',
      }}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.replace('Main')}
    />
  );
}
