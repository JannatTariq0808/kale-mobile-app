// Design: lum-18 KaleFitnessStrengthLumen (screens/KaleLumenApp2.jsx)

import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fitnessStrength } from '../../data/fitnessDemo';
import { useStrengthQuestions } from '../../hooks/useStrengthQuestions';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { FaqAccordion } from '../lumen/FaqAccordion';
import { PillarLevelOverTimeChart, getPillarLevelChartWidth } from '../lumen/PillarLevelOverTimeChart';
import { LumHeroRing } from '../lumen/LumHeroRing';
import { LumenCard } from '../lumen/LumenCard';
import { RelativePerformanceGauge } from '../lumen/RelativePerformanceGauge';
import { lumen, lumenPillar, sora } from '../../theme';

export function StrengthPanel() {
  const { type, scale, leading, isCompact, isTight, contentWidth, cardPadding } = useResponsiveLayout();
  const { items: faqItems, loading: faqLoading } = useStrengthQuestions();
  const ringSize = scale(isCompact ? 84 : 96);
  const heroLevelSize = type(44);
  const timeSize = type(isTight ? 36 : 40);
  const prevTimeSize = type(isTight ? 24 : 28);
  const statDividerGap = isTight ? 10 : 12;
  const chartPointSpacing = 56;
  const chartViewportWidth = Math.max(260, contentWidth - cardPadding * 2);
  const trendLevels = fitnessStrength.levelTrend.levels;
  const chartContentWidth = getPillarLevelChartWidth(trendLevels.length, chartPointSpacing);

  return (
    <View style={styles.wrap}>
      <View style={styles.heroRow}>
        <LumHeroRing
          value={fitnessStrength.level}
          pct={fitnessStrength.levelPct}
          size={ringSize}
          stroke={7}
          accentColor={lumenPillar.strength}
        />
        <View style={styles.heroCopy}>
          <Text style={[styles.heroEyebrow, { fontSize: type(11) }]}>Strength Level</Text>
          <View style={styles.heroLevelRow}>
            <Text style={[styles.heroLevel, { fontSize: heroLevelSize, lineHeight: leading(heroLevelSize, 1.08) }]}>
              {fitnessStrength.level}
            </Text>
            <View style={styles.trendChip}>
              <Ionicons name="arrow-up" size={10} color={lumen.mint} />
              <Text style={[styles.trendChipText, { fontSize: type(11) }]}>+{fitnessStrength.trendDelta}</Text>
            </View>
          </View>
          <Text style={[styles.percentile, { fontSize: type(12) }]}>
            Top <Text style={styles.percentileStrong}>{fitnessStrength.percentileTop}%</Text> of{' '}
            {fitnessStrength.percentileCohort}.
          </Text>
        </View>
      </View>

      <LumenCard style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={[styles.sectionLabel, { fontSize: type(11) }]}>Strength level over time</Text>
          <Text style={[styles.chartChips, { fontSize: type(11) }]}>{fitnessStrength.levelTrend.chips}</Text>
        </View>
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={[styles.chartScroll, { width: chartViewportWidth }]}
          contentContainerStyle={styles.chartScrollContent}
        >
          <PillarLevelOverTimeChart
            levels={[...fitnessStrength.levelTrend.levels]}
            labels={[...fitnessStrength.levelTrend.labels]}
            color={lumenPillar.strength}
            width={Math.max(chartViewportWidth, chartContentWidth)}
            pointSpacing={chartPointSpacing}
          />
        </ScrollView>
      </LumenCard>

      <LumenCard accent={lumenPillar.strength} style={styles.testCard}>
        <View style={styles.testHeader}>
          <View>
            <Text style={[styles.testEyebrow, { fontSize: type(11) }]}>This cycle&apos;s test</Text>
            <Text style={[styles.testTitle, { fontSize: type(22), lineHeight: leading(type(22), 1.2) }]}>
              {fitnessStrength.currentTest.name}
            </Text>
          </View>
          <View style={styles.newBadge}>
            <Text style={[styles.newBadgeText, { fontSize: type(10) }]}>NEW</Text>
          </View>
        </View>

        <View style={styles.testStats}>
          <View style={styles.testStatCol}>
            <Text style={[styles.testStatLabel, { fontSize: type(10) }]}>Today</Text>
            <Text
              style={[styles.testStatValue, { fontSize: timeSize, lineHeight: leading(timeSize, 1.08) }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {fitnessStrength.currentTest.today}
            </Text>
          </View>
          <View style={[styles.testDivider, { marginHorizontal: statDividerGap }]} />
          <View style={styles.testStatCol}>
            <Text style={[styles.testStatLabel, { fontSize: type(10) }]}>Cycle 2</Text>
            <Text
              style={[
                styles.testStatValueMuted,
                { fontSize: prevTimeSize, lineHeight: leading(prevTimeSize, 1.08) },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {fitnessStrength.currentTest.previousCycle}
            </Text>
          </View>
          <View style={styles.improveCol}>
            <View style={styles.improveChip}>
              <Ionicons name="arrow-up" size={11} color={lumen.mint} />
              <Text style={[styles.improveText, { fontSize: type(13) }]}>
                {fitnessStrength.currentTest.improvement}
              </Text>
            </View>
          </View>
        </View>

        <RelativePerformanceGauge
          value={fitnessStrength.currentTest.relativePerformance}
          gender={fitnessStrength.currentTest.cohortGender}
          ageRange={fitnessStrength.currentTest.cohortAgeRange}
          pillar="strength"
        />
      </LumenCard>

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
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginBottom: 20,
  },
  heroCopy: {
    flex: 1,
  },
  heroEyebrow: {
    ...sora('bold'),
    color: lumenPillar.strength,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroLevelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 6,
  },
  heroLevel: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -1.6,
    fontVariant: ['tabular-nums'],
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  trendChipText: {
    ...sora('extrabold'),
    color: lumen.mint,
  },
  percentile: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    marginTop: 6,
  },
  percentileStrong: {
    ...sora('extrabold'),
    color: lumen.fg,
  },
  chartCard: {
    marginBottom: 14,
    overflow: 'visible',
  },
  chartScroll: {
    overflow: 'visible',
  },
  chartScrollContent: {
    paddingRight: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chartChips: {
    ...sora('bold'),
    color: lumenPillar.strength,
    letterSpacing: 0.8,
  },
  testCard: {
    marginBottom: 14,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  testEyebrow: {
    ...sora('extrabold'),
    color: lumenPillar.strength,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  testTitle: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -0.4,
    marginTop: 6,
  },
  newBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(232,130,110,0.18)',
  },
  newBadgeText: {
    ...sora('extrabold'),
    color: lumenPillar.strength,
    letterSpacing: 1.2,
  },
  testStats: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  testStatCol: {
    flex: 1,
    minWidth: 0,
  },
  testDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: lumen.hairline,
  },
  testStatLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  testStatValue: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -0.8,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  testStatValueMuted: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    letterSpacing: -0.6,
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  improveCol: {
    flexShrink: 0,
    marginLeft: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  improveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  improveText: {
    ...sora('extrabold'),
    color: lumen.mint,
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
