// Design: lum-19 KaleFitnessKnowledgeLumen (screens/KaleLumenApp2.jsx)

import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fitnessKnowledge } from '../../data/fitnessDemo';
import { useKnowledgeQuestions } from '../../hooks/useKnowledgeQuestions';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { FaqAccordion } from '../lumen/FaqAccordion';
import { KnowledgeScoreChart, getKnowledgeChartWidth } from '../lumen/KnowledgeScoreChart';
import { LumHeroRing } from '../lumen/LumHeroRing';
import { LumenCard } from '../lumen/LumenCard';
import { lumen, lumenPillar, sora } from '../../theme';

function TopicRow({
  label,
  score,
  max,
  isLast,
  fontSize,
}: {
  label: string;
  score: number;
  max: number;
  isLast: boolean;
  fontSize: number;
}) {
  const pct = max > 0 ? (score / max) * 100 : 0;

  return (
    <View style={[styles.topicRow, !isLast && styles.topicRowBorder]}>
      <View style={styles.topicHeader}>
        <Text style={[styles.topicLabel, { fontSize }]}>{label}</Text>
        <Text style={[styles.topicScore, { fontSize }]}>
          {score}
          <Text style={styles.topicMax}> / {max}</Text>
        </Text>
      </View>
      <View style={styles.topicTrack}>
        <View style={[styles.topicFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export function KnowledgePanel() {
  const { type, scale, isCompact, contentWidth, cardPadding } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useKnowledgeQuestions();
  const ringSize = scale(isCompact ? 84 : 96);
  const scoreSize = type(42);
  const chartPointSpacing = 56;
  const chartViewportWidth = Math.max(260, contentWidth - cardPadding * 2);
  const history = fitnessKnowledge.scoreHistory;
  const chartContentWidth = getKnowledgeChartWidth(history.scores.length, chartPointSpacing);
  const showChartScroll = history.scores.length > 4;

  return (
    <View style={styles.wrap}>
      <View style={styles.heroRow}>
        <LumHeroRing
          value={fitnessKnowledge.level}
          pct={fitnessKnowledge.levelPct}
          size={ringSize}
          stroke={7}
          accentColor={lumenPillar.knowledge}
        />
        <View style={styles.heroCopy}>
          <Text style={[styles.heroEyebrow, { fontSize: type(11) }]}>Latest quiz</Text>
          <View style={styles.heroScoreRow}>
            <Text style={[styles.heroScore, { fontSize: scoreSize, lineHeight: scoreSize * 0.95 }]}>
              {fitnessKnowledge.latestScore}
            </Text>
            <Text style={[styles.heroMax, { fontSize: type(16), lineHeight: type(20) }]}>
              / {fitnessKnowledge.maxScore}
            </Text>
            <Text style={[styles.heroPct, { fontSize: type(13) }]}>{fitnessKnowledge.scorePct}%</Text>
          </View>
          <View style={styles.trendChip}>
            <Ionicons name="arrow-up" size={11} color={lumen.mint} />
            <Text style={[styles.trendChipText, { fontSize: type(12) }]}>
              {fitnessKnowledge.trendLabel}
            </Text>
          </View>
        </View>
      </View>

      <LumenCard style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={[styles.sectionLabel, { fontSize: type(11) }]}>Score history</Text>
          <Text style={[styles.chartChip, { fontSize: type(11) }]}>{history.chip}</Text>
        </View>
        {showChartScroll ? (
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            style={{ width: chartViewportWidth }}
            contentContainerStyle={styles.chartScrollContent}
          >
            <KnowledgeScoreChart
              scores={[...history.scores]}
              labels={[...history.labels]}
              color={lumenPillar.knowledge}
              maxScore={fitnessKnowledge.maxScore}
              width={Math.max(chartViewportWidth, chartContentWidth)}
              pointSpacing={chartPointSpacing}
            />
          </ScrollView>
        ) : (
          <KnowledgeScoreChart
            scores={[...history.scores]}
            labels={[...history.labels]}
            color={lumenPillar.knowledge}
            maxScore={fitnessKnowledge.maxScore}
            width={chartViewportWidth}
          />
        )}
      </LumenCard>

      <LumenCard style={styles.topicsCard}>
        <Text style={[styles.sectionLabel, { fontSize: type(11), marginBottom: 14 }]}>By topic</Text>
        {fitnessKnowledge.topics.map((topic, index) => (
          <TopicRow
            key={topic.label}
            label={topic.label}
            score={topic.score}
            max={topic.max}
            isLast={index === fitnessKnowledge.topics.length - 1}
            fontSize={type(13)}
          />
        ))}
      </LumenCard>

      <LumenCard accent={lumenPillar.knowledge} style={styles.upNextCard}>
        <Text style={[styles.upNextEyebrow, { fontSize: type(11) }]}>Up next</Text>
        <Text style={[styles.upNextCopy, { fontSize: type(14), lineHeight: type(21) }]}>
          We&apos;ll focus your next quiz on{' '}
          <Text style={styles.upNextAccent}>
            {fitnessKnowledge.upNext.focusTopic.charAt(0).toUpperCase()}
            {fitnessKnowledge.upNext.focusTopic.slice(1)}
          </Text> — your weakest
          topic.
        </Text>
      </LumenCard>

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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginBottom: 18,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroEyebrow: {
    ...sora('bold'),
    color: lumenPillar.knowledge,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 6,
  },
  heroScore: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  heroMax: {
    ...sora('bold'),
    color: lumen.fgMuted,
  },
  heroPct: {
    ...sora('extrabold'),
    color: lumenPillar.knowledge,
    marginLeft: 8,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  trendChipText: {
    ...sora('bold'),
    color: lumen.mint,
  },
  chartCard: {
    marginBottom: 14,
    overflow: 'visible',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  chartScrollContent: {
    paddingRight: 4,
  },
  sectionLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chartChip: {
    ...sora('bold'),
    color: lumenPillar.knowledge,
    letterSpacing: 0.8,
  },
  topicsCard: {
    marginBottom: 14,
  },
  topicRow: {
    paddingVertical: 8,
  },
  topicRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  topicLabel: {
    ...sora('semibold'),
    color: lumen.fg,
    flex: 1,
    paddingRight: 8,
  },
  topicScore: {
    ...sora('extrabold'),
    color: lumen.fg,
    fontVariant: ['tabular-nums'],
  },
  topicMax: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  topicTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(234,243,228,0.08)',
    overflow: 'hidden',
  },
  topicFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: lumen.lime,
  },
  upNextCard: {
    marginBottom: 14,
  },
  upNextEyebrow: {
    ...sora('bold'),
    color: lumenPillar.knowledge,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  upNextCopy: {
    ...sora('regular'),
    color: lumen.fg,
  },
  upNextAccent: {
    ...sora('extrabold'),
    color: lumenPillar.knowledge,
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
