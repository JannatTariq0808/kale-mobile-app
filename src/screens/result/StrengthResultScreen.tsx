// Design: kale-mobile-design — lum-05 KaleStrengthResultLumen (screens/KaleLumenResults.jsx)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { LumenResultView } from '../../components/lumen/LumenResultView';
import type { RootStackParamList } from '../../navigation/types';
import { formatPlankDuration } from '../../utils/formatPlankDuration';
import { plankHoldSecForLevel } from '../../utils/strengthLevel';

type Props = NativeStackScreenProps<RootStackParamList, 'StrengthResult'>;

export function StrengthResultScreen({ navigation, route }: Props) {
  const { analysis, elapsed_time, level } = route.params;
  const holdLabel = formatPlankDuration(elapsed_time);
  const nextLevel = Math.min(10, level + 1);
  const nextHoldTarget = formatPlankDuration(plankHoldSecForLevel(nextLevel));
  const rpPercent = Math.min(99, Math.max(1, level * 10));

  const config = useMemo(
    () => ({
      pillar: 'strength' as const,
      pillarLabel: 'Strength',
      level,
      trend: 'same' as const,
      levelNote:
        analysis.source === 'recording_timer'
          ? 'Hold time from your in-app recording — pose check coming soon.'
          : 'Plank verified from your recording.',
      percentile: rpPercent,
      rpText: `Stronger than ${rpPercent}% of Kale members.`,
      resultHero: holdLabel,
      resultLabel: 'Plank hold — in-app recording.',
      tiles: [
        { label: 'Source', value: analysis.source === 'recording_timer' ? 'Live' : 'Verified' },
        { label: `Level ${nextLevel} at`, value: nextHoldTarget, unit: 'hold' },
        { label: 'This hold', value: holdLabel },
      ],
      nextLevel,
      nextActions: [
        `Hold the plank past ${nextHoldTarget}`,
        'Add the wall sit next cycle',
        'Train your core twice a week',
      ],
      nextBtn: 'Next — Knowledge',
    }),
    [analysis.source, holdLabel, level, nextHoldTarget, nextLevel, rpPercent],
  );

  return (
    <LumenResultView
      config={config}
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('KnowledgeIntro')}
    />
  );
}
