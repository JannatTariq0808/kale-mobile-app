// Design: Q1 single-assessment summary — level, lifespan / healthspan, quarter roadmap

import { StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';
import { LumenCard } from './LumenCard';
import { getCurrentQuarterIndex } from '../../utils/assessmentCycle';
import { QuarterBaselineTimeline } from './QuarterBaselineTimeline';

type FirstAssessmentCardProps = {
  level: number;
  lifespanYears: number;
  healthspanYears: number;
};

export function FirstAssessmentCard({
  level,
  lifespanYears,
  healthspanYears,
}: FirstAssessmentCardProps) {
  const { type } = useResponsiveLayout();
  const valueSize = type(28);
  const valueLineHeight = Math.round(valueSize * 1.28);
  const labelSize = type(13);

  return (
    <LumenCard style={styles.card}>
      <Text style={[styles.levelTitle, { fontSize: type(18) }]}>
        Level <Text style={styles.levelAccent}>{level}</Text>
      </Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricCol}>
          <View style={styles.labelRow}>
            <View style={[styles.legendDot, { backgroundColor: lumenPillar.cardio }]} />
            <Text style={[styles.metricLabel, { fontSize: labelSize }]}>Lifespan</Text>
          </View>
          <Text
            style={[
              styles.metricValue,
              styles.metricValueCardio,
              { fontSize: valueSize, lineHeight: valueLineHeight },
            ]}
          >
            +{lifespanYears} years
          </Text>
        </View>
        <View style={styles.metricCol}>
          <View style={styles.labelRow}>
            <View style={[styles.legendDot, { backgroundColor: lumenPillar.knowledge }]} />
            <Text style={[styles.metricLabel, { fontSize: labelSize }]}>Healthspan</Text>
          </View>
          <Text
            style={[
              styles.metricValue,
              styles.metricValueKnowledge,
              { fontSize: valueSize, lineHeight: valueLineHeight },
            ]}
          >
            +{healthspanYears} years
          </Text>
        </View>
      </View>

      <View style={styles.timelineWrap}>
        <QuarterBaselineTimeline activeIndex={getCurrentQuarterIndex()} />
      </View>
    </LumenCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
  },
  levelTitle: {
    ...sora('bold'),
    color: lumen.fg,
    textAlign: 'center',
  },
  levelAccent: {
    color: lumen.lime,
  },
  metricsRow: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 16,
  },
  metricCol: {
    flex: 1,
    alignItems: 'flex-start',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  metricValue: {
    ...sora('bold'),
    marginTop: 10,
    letterSpacing: -0.5,
  },
  metricValueCardio: {
    color: lumenPillar.cardio,
  },
  metricValueKnowledge: {
    color: lumenPillar.knowledge,
  },
  timelineWrap: {
    marginTop: 8,
  },
});
