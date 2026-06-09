// Design: kale-mobile-design — lum-05 KaleStrengthResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LumenResultView } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthResult'>;

export function StrengthResultScreen({ navigation }: Props) {
  return (
    <LumenResultView
      config={{
        pillar: 'strength',
        pillarLabel: 'Strength',
        level: 5,
        trend: 'same',
        levelNote: 'Held at Level 5 — wall sits next cycle will push it.',
        percentile: 71,
        rpText: 'Stronger than 71% of women aged 35–40.',
        resultHero: '1:43',
        resultLabel: 'Plank hold — video verified.',
        tiles: [
          { label: 'Category', value: 'Good' },
          { label: 'Level 6 at', value: '2:00', unit: 'hold' },
          { label: 'Best ever', value: '1:43' },
        ],
        nextLevel: 6,
        nextActions: [
          'Hold the plank past 2:00',
          'Add the wall sit next cycle',
          'Train your core twice a week',
        ],
        nextBtn: 'Next — Knowledge',
      }}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('KnowledgeIntro')}
    />
  );
}
