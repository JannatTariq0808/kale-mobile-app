// Design: lum-19 KaleFitnessKnowledgeLumen — assessment summary card

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useKnowledgeQuestions } from '../../hooks/useKnowledgeQuestions';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import type { FitnessKnowledgeData } from '../../services/fitness/fetchFitnessPillarData';
import { FaqAccordion } from '../lumen/FaqAccordion';
import { LumenCard } from '../lumen/LumenCard';
import { PillarAssessmentCard } from './PillarAssessmentCard';
import { lumen, lumenPillar, sora } from '../../theme';

export function KnowledgePanel({
  data,
  loading,
}: {
  data: FitnessKnowledgeData;
  loading: boolean;
}) {
  const { type } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useKnowledgeQuestions();

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator color={lumenPillar.knowledge} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      {data.current ? (
        <PillarAssessmentCard pillar="knowledge" data={data.current} variant="summary" />
      ) : (
        <LumenCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { fontSize: type(14) }]}>
            Complete your knowledge quiz to see your score and level progress.
          </Text>
        </LumenCard>
      )}

      {data.pastAssessments.length > 0 ? (
        <View style={styles.historySection}>
          <Text style={[styles.historyTitle, { fontSize: type(16) }]}>Past knowledge assessments</Text>
          {data.pastAssessments.map((assessment) => (
            <PillarAssessmentCard
              key={`${assessment.dateLabel}-${assessment.scoreLabel}`}
              pillar="knowledge"
              data={assessment}
              variant="history"
            />
          ))}
        </View>
      ) : null}

      <Text style={[styles.faqLabel, { fontSize: type(11) }]}>Common questions</Text>
      {faqLoading ? (
        <ActivityIndicator color={lumenPillar.knowledge} style={styles.faqLoader} />
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
