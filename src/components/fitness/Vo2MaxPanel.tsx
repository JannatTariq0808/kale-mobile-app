// Design: lum-14 KaleFitnessVO2Lumen (screens/KaleLumenApp.jsx)

import { StyleSheet, Text, View } from 'react-native';
import type { FitnessCardioVo2Data } from '../../services/fitness/fetchFitnessPillarData';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LumenCard } from '../lumen/LumenCard';
import { PillarAssessmentCard } from './PillarAssessmentCard';
import { lumen, sora } from '../../theme';

export function Vo2MaxPanel({
  data,
}: {
  data: FitnessCardioVo2Data;
}) {
  const { type } = useResponsiveLayout();

  return (
    <View style={styles.wrap}>
      {data.current ? (
        <PillarAssessmentCard pillar="cardio" data={data.current} variant="summary" />
      ) : (
        <LumenCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { fontSize: type(14) }]}>
            Complete your cardio assessment to see your VO₂max estimate and level progress.
          </Text>
        </LumenCard>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  emptyCard: {
    marginBottom: 14,
  },
  emptyText: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    textAlign: 'center',
  },
});
