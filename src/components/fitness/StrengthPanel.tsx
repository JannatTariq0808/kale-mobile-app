// Design: lum-18 KaleFitnessStrengthLumen — assessment summary card

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useStrengthQuestions } from '../../hooks/useStrengthQuestions';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { FitnessStrengthData } from '../../services/fitness/fetchFitnessPillarData';
import { FaqAccordion } from '../lumen/FaqAccordion';
import { LumenCard } from '../lumen/LumenCard';
import { PillarAssessmentCard } from './PillarAssessmentCard';
import { lumen, lumenPillar, sora } from '../../theme';

export function StrengthPanel({
  data,
  loading,
}: {
  data: FitnessStrengthData;
  loading: boolean;
}) {
  const { type } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useStrengthQuestions();

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator color={lumenPillar.strength} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {data.current ? (
        <PillarAssessmentCard pillar="strength" data={data.current} variant="summary" />
      ) : (
        <LumenCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { fontSize: type(14) }]}>
            Complete your strength test to see your hold time and level progress.
          </Text>
        </LumenCard>
      )}

      {data.pastAssessments.length > 0 ? (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { fontSize: type(16) }]}>Past strength assessments</Text>
          {data.pastAssessments.map((assessment) => (
            <PillarAssessmentCard
              key={`${assessment.dateLabel}-${assessment.scoreLabel}`}
              pillar="strength"
              data={assessment}
              variant="history"
            />
          ))}
        </View>
      ) : null}

      <Text style={[styles.faqLabel, { fontSize: type(11) }]}>Common questions</Text>
      {faqLoading ? (
        <ActivityIndicator color={lumenPillar.strength} style={styles.faqLoader} />
      ) : (
        <FaqAccordion items={faqItems} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  loaderWrap: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyCard: {
    marginBottom: 14,
  },
  emptyText: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 8,
  },
  historyTitle: {
    ...sora('bold'),
    color: lumen.fg,
    marginBottom: 12,
  },
  faqLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 6,
  },
  faqLoader: {
    marginVertical: 20,
  },
});
