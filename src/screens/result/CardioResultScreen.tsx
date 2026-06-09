// Design: kale-mobile-design — lum-02 KaleCardioResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LumenResultView } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CardioResult'>;

export function CardioResultScreen({ navigation }: Props) {
  return (
    <LumenResultView
      config={{
        pillar: 'cardio',
        pillarLabel: 'Cardio',
        level: 6,
        trend: 'up',
        trendDelta: 1,
        levelNote: 'Up from Level 5 last cycle.',
        percentile: 90,
        rpText: 'Fitter than 90% of men aged 35–40.',
        resultHero: '54',
        resultUnit: 'ml/kg·min',
        resultLabel: 'Estimated VO₂max — your strongest longevity signal.',
        tiles: [
          { label: 'Best pace', value: '4:48', unit: '/km' },
          { label: 'Best run', value: '12.4km', unit: '14 Feb' },
          { label: 'Resting HR', value: '52', unit: 'bpm' },
        ],
        nextLevel: 7,
        nextActions: [
          'Add one Zone-2 long run each week',
          'Nudge your VO₂max past 56',
          'Keep the 80/20 easy-to-hard split',
        ],
        nextBtn: 'Next — Strength',
      }}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('StrengthIntro')}
    />
  );
}
