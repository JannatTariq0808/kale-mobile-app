import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { HealthYearsTrendChart } from '../components/lumen/HealthYearsTrendChart';
import { LegendDot, QuickStatPillar } from '../components/lumen/HomeMetrics';
import { LongevityLevelTrendChart } from '../components/lumen/LongevityLevelTrendChart';
import { LumHeroRing } from '../components/lumen/LumHeroRing';
import { LumenBackground } from '../components/lumen/LumenBackground';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenButton } from '../components/lumen/LumenButton';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { QuarterBaselineTimeline } from '../components/lumen/QuarterBaselineTimeline';
import { homeDemo } from '../data/homeDemo';
import { lumen, lumenPillar, sora } from '../theme';

function SectionEyebrow({ children, trailing }: { children: string; trailing?: string }) {
  const { type } = useResponsiveLayout();
  const labelSize = type(11);

  return (
    <View style={styles.eyebrowRow}>
      <Text
        style={[
          styles.eyebrow,
          { fontSize: labelSize, letterSpacing: 0.6 },
        ]}
        numberOfLines={2}
      >
        {children}
      </Text>
      {trailing ? (
        <Text
          style={[
            styles.eyebrowTrailing,
            { fontSize: labelSize, letterSpacing: 0.6 },
            styles.eyebrowTrailingStack,
          ]}
        >
          {trailing}
        </Text>
      ) : null}
    </View>
  );
}

function BaselineLevelReadout() {
  const { type } = useResponsiveLayout();
  const valueSize = type(34);

  return (
    <View style={styles.baselineReadout}>
      <Text style={[styles.baselineValue, { fontSize: valueSize, lineHeight: valueSize + 4 }]}>
        Level <Text style={styles.baselineValueAccent}>{homeDemo.level}</Text>
      </Text>
      <Text style={[styles.baselineHint, { fontSize: type(12) }]}>Recorded at Q1</Text>
    </View>
  );
}

function BaselineHealthReadout() {
  const { type, isTight } = useResponsiveLayout();
  const valueSize = type(isTight ? 24 : 28);

  return (
    <View style={[styles.baselineMetrics, isTight && styles.baselineMetricsTight]}>
      <View style={styles.baselineMetric}>
        <Text style={[styles.baselineMetricValue, { fontSize: valueSize }]}>+{homeDemo.lifespanYears}y</Text>
        <Text style={[styles.baselineMetricLabel, { fontSize: type(11) }]}>Lifespan</Text>
      </View>
      <View style={styles.baselineDivider} />
      <View style={styles.baselineMetric}>
        <Text style={[styles.baselineMetricValue, { fontSize: valueSize }]}>+{homeDemo.healthspanYears}y</Text>
        <Text style={[styles.baselineMetricLabel, { fontSize: type(11) }]}>Healthspan</Text>
      </View>
    </View>
  );
}

export function LongevityScreen() {
  const { scale, type, isCompact, isNarrow, isTight, cardPadding } = useResponsiveLayout();
  const isFirstAssessment = homeDemo.assessmentCount <= 1;
  const heroRingSize = scale(isCompact ? 80 : 104);
  const statSize = type(isNarrow ? 36 : 52);
  const countdownSize = type(isTight ? 34 : 46);
  const promoPad = isTight ? Math.max(12, cardPadding - 4) : cardPadding;

  return (
    <View style={styles.screen}>
      <LumenBackground />
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.greeting, { fontSize: type(21), lineHeight: type(26) }]}>
          {homeDemo.firstName}, training today is training for{' '}
          <Text style={styles.greetingAccent}>your future</Text>.
        </Text>

        <View style={[styles.levelRow, { gap: scale(isTight ? 14 : 22) }]}>
          <LumHeroRing value={homeDemo.level} pct={homeDemo.levelPct} size={heroRingSize} />
          <View style={styles.levelCopy}>
            <Text style={[styles.levelTitle, { fontSize: type(30), lineHeight: type(30) }]}>
              Level <Text style={styles.levelTitleAccent}>{homeDemo.level}</Text>
            </Text>
            <Text style={[styles.levelSubtitle, { fontSize: type(13) }]}>Your Longevity Level</Text>
            <View style={styles.trendChip}>
              <Ionicons name="arrow-up" size={11} color={lumen.mint} />
              <Text style={[styles.trendChipText, { fontSize: type(12) }]}>
                +{homeDemo.trendDelta} this cycle
              </Text>
            </View>
          </View>
        </View>

        <LumenCard accent={lumen.coral} style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Text style={[styles.nextLabel, { fontSize: type(11) }]}>Next assessment</Text>
            <Text style={[styles.nextProgress, { fontSize: type(12) }]}>
              {homeDemo.cycleProgressPct}% through cycle
            </Text>
          </View>
          <View style={[styles.countdownRow, isTight && styles.countdownRowWrap]}>
            <Text style={[styles.countdownNum, { fontSize: countdownSize, lineHeight: countdownSize }]}>
              {homeDemo.weeksToAssessment}
            </Text>
            <Text style={[styles.countdownUnit, { fontSize: type(14) }]}>weeks</Text>
            <Text
              style={[
                styles.countdownNum,
                styles.countdownGap,
                { fontSize: countdownSize, lineHeight: countdownSize },
              ]}
            >
              {homeDemo.daysToAssessment}
            </Text>
            <Text style={[styles.countdownUnit, { fontSize: type(14) }]}>days</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${homeDemo.cycleProgressPct}%` }]} />
          </View>
          <Text style={[styles.nextReward, { fontSize: type(13) }]}>
            Complete it to bank{' '}
            <Text style={styles.nextRewardAccent}>{homeDemo.kaletteReward} Kalettes</Text>.
          </Text>
        </LumenCard>

        <LumenCard style={styles.chartCard}>
          <SectionEyebrow trailing={isFirstAssessment ? 'Q1 baseline' : '5y outlook'}>
            Health Years over time
          </SectionEyebrow>
          {isFirstAssessment ? (
            <>
              <BaselineHealthReadout />
              <QuarterBaselineTimeline activeIndex={0} />
            </>
          ) : (
            <HealthYearsTrendChart />
          )}
          <View style={styles.legendRow}>
            <LegendDot color={lumenPillar.cardio} label={`Lifespan +${homeDemo.lifespanYears}y`} />
            <LegendDot color={lumenPillar.knowledge} label={`Healthspan +${homeDemo.healthspanYears}y`} />
            <Text style={styles.levelTag}>at Level {homeDemo.level}</Text>
          </View>
        </LumenCard>

        <LumenCard style={styles.chartCard}>
          <SectionEyebrow trailing={isFirstAssessment ? 'Q1 baseline' : `${homeDemo.assessmentCount} QUARTERS`}>
            Longevity Level over time
          </SectionEyebrow>
          {isFirstAssessment ? (
            <>
              <BaselineLevelReadout />
              <QuarterBaselineTimeline activeIndex={0} />
            </>
          ) : (
            <LongevityLevelTrendChart
              levels={[3, 4, 5, homeDemo.level]}
              labels={['Q1', 'Q2', 'Q3', 'Now']}
            />
          )}
        </LumenCard>

        <View style={isTight ? styles.quickStatsStack : styles.quickStats}>
          <QuickStatPillar pillar="Cardio" level={homeDemo.pillarLevels.cardio} color={lumenPillar.cardio} />
          <QuickStatPillar pillar="Strength" level={homeDemo.pillarLevels.strength} color={lumenPillar.strength} />
          <QuickStatPillar pillar="Knowledge" level={homeDemo.pillarLevels.knowledge} color={lumenPillar.knowledge} />
        </View>

        <LinearGradient
          colors={['rgba(204,250,125,0.14)', 'rgba(0,200,150,0.08)', 'rgba(234,243,228,0.04)']}
          locations={[0, 0.55, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.promo, { padding: promoPad }]}
        >
          <View style={styles.promoBadgeRow}>
            <Text style={[styles.promoBadge, { fontSize: type(10.5) }]}>New</Text>
            <View style={styles.promoRule} />
          </View>
          <View style={styles.promoBody}>
            <View style={styles.promoCopy}>
              <Text style={[styles.promoTitle, { fontSize: type(23), lineHeight: type(25) }]}>
                Your <Text style={styles.promoTitleAccent}>Running Years</Text>
              </Text>
              <Text style={[styles.promoText, { fontSize: type(13.5), lineHeight: type(19.6) }]}>
                See the good years you've got ahead — and the moments worth training for.
              </Text>
            </View>
            <View style={[styles.promoStat, styles.promoStatStacked]}>
              <Text style={[styles.promoStatTilde, { fontSize: type(14) }]}>~</Text>
              <Text
                style={[
                  styles.promoStatNum,
                  { fontSize: statSize, lineHeight: Math.round(statSize * 0.85) },
                ]}
              >
                {homeDemo.runningYearsAhead}
              </Text>
              <Text style={[styles.promoStatLabel, { fontSize: type(11) }]}>years ahead</Text>
            </View>
          </View>
          <LumenButton style={styles.promoButton}>Explore your Running Years</LumenButton>
        </LinearGradient>
        </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
    overflow: 'hidden',
    width: '100%',
  },
  scrollContent: {
    paddingTop: 18,
  },
  greeting: {
    ...sora('bold'),
    letterSpacing: -0.32,
    color: lumen.fg,
  },
  greetingAccent: {
    color: lumen.lime,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 22,
    marginTop: 16,
    minWidth: 0,
  },
  levelCopy: {
    flex: 1,
    minWidth: 0,
  },
  levelTitle: {
    ...sora('extrabold'),
    letterSpacing: -0.75,
    color: lumen.fg,
  },
  levelTitleAccent: {
    color: lumen.lime,
  },
  levelSubtitle: {
    ...sora('bold'),
    marginTop: 6,
    color: lumen.fgMuted,
  },
  trendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.15)',
  },
  trendChipText: {
    ...sora('bold'),
    fontSize: 12,
    color: lumen.mint,
  },
  nextCard: {
    marginTop: 16,
  },
  nextHeader: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 10,
    minWidth: 0,
    width: '100%',
  },
  nextHeaderStack: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
  },
  nextLabel: {
    ...sora('bold'),
    letterSpacing: 1.32,
    textTransform: 'uppercase',
    color: lumen.coral,
    flexShrink: 0,
  },
  nextProgress: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    flexShrink: 1,
    textAlign: 'left',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'nowrap',
  },
  countdownRowWrap: {
    flexWrap: 'wrap',
    rowGap: 2,
  },
  countdownNum: {
    ...sora('semibold'),
    letterSpacing: -1.38,
    color: lumen.lime,
  },
  countdownGap: {
    marginLeft: 10,
  },
  countdownUnit: {
    ...sora('bold'),
    marginLeft: 6,
    color: lumen.fgMuted,
  },
  progressTrack: {
    marginTop: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(234,243,228,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: lumen.lime,
  },
  nextReward: {
    ...sora('semibold'),
    marginTop: 12,
    fontSize: 13,
    color: lumen.fg,
  },
  nextRewardAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  chartCard: {
    marginTop: 14,
  },
  eyebrowRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    marginBottom: 14,
    width: '100%',
  },
  eyebrow: {
    ...sora('bold'),
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    flexShrink: 1,
    minWidth: 0,
    width: '100%',
  },
  eyebrowTrailing: {
    ...sora('semibold'),
    textTransform: 'uppercase',
    color: lumen.lime,
    flexShrink: 0,
  },
  eyebrowTrailingStack: {
    marginLeft: 0,
  },
  baselineReadout: {
    alignItems: 'center',
    marginBottom: 8,
  },
  baselineValue: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -1,
  },
  baselineValueAccent: {
    color: lumen.lime,
  },
  baselineHint: {
    ...sora('semibold'),
    marginTop: 4,
    fontSize: 12,
    color: lumen.fgMuted,
  },
  baselineMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 20,
  },
  baselineMetric: {
    alignItems: 'center',
  },
  baselineMetricsTight: {
    gap: 12,
  },
  baselineMetricValue: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -0.8,
  },
  baselineMetricLabel: {
    ...sora('bold'),
    marginTop: 4,
    fontSize: 11,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  baselineDivider: {
    width: 1,
    height: 36,
    backgroundColor: lumen.hairline,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  levelTag: {
    ...sora('semibold'),
    marginLeft: 'auto',
    fontSize: 11,
    color: lumen.fgMuted,
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 14,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    gap: 8,
  },
  quickStatsStack: {
    flexDirection: 'column',
    marginTop: 14,
    width: '100%',
    maxWidth: '100%',
    gap: 10,
  },
  promo: {
    marginTop: 14,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.28)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '100%',
  },
  promoButton: {
    marginTop: 18,
    height: 50,
    backgroundColor: lumen.lime,
  },
  promoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoBadge: {
    ...sora('extrabold'),
    fontSize: 10.5,
    letterSpacing: 1.68,
    textTransform: 'uppercase',
    color: lumen.lime,
  },
  promoRule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(204,250,125,0.25)',
  },
  promoBody: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    minWidth: 0,
    width: '100%',
  },
  promoCopy: {
    flex: 1,
    minWidth: 0,
    width: '100%',
  },
  promoTitle: {
    ...sora('extrabold'),
    fontSize: 23,
    lineHeight: 25,
    letterSpacing: -0.58,
    color: lumen.fg,
  },
  promoTitleAccent: {
    color: lumen.lime,
  },
  promoText: {
    ...sora('semibold'),
    marginTop: 8,
    fontSize: 13.5,
    lineHeight: 19.6,
    color: lumen.fgMuted,
  },
  promoStat: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  promoStatStacked: {
    alignSelf: 'flex-start',
  },
  promoStatTilde: {
    ...sora('semibold'),
    fontSize: 14,
    color: lumen.fgMuted,
  },
  promoStatNum: {
    ...sora('semibold'),
    letterSpacing: -2,
    color: lumen.lime,
  },
  promoStatLabel: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 12,
    color: lumen.fg,
    flexShrink: 1,
  },
});
