import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { useAssessmentCycle } from '../hooks/useAssessmentCycle';
import { useAssessmentWindow } from '../hooks/useAssessmentWindow';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { AssessmentLiveCard } from '../components/lumen/AssessmentLiveCard';
import { FirstAssessmentCard } from '../components/lumen/FirstAssessmentCard';
import { HealthYearsTrendChart } from '../components/lumen/HealthYearsTrendChart';
import { LegendDot, QuickStatPillar } from '../components/lumen/HomeMetrics';
import { LongevityLevelTrendChart } from '../components/lumen/LongevityLevelTrendChart';
import { LumHeroRing } from '../components/lumen/LumHeroRing';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenButton } from '../components/lumen/LumenButton';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { TrendChartScroll } from '../components/lumen/TrendChartScroll';
import { getHomeChartSeries } from '../data/homeChartData';
import { homeDemo } from '../data/homeDemo';
import { lumen, lumenPillar, sora } from '../theme';

function SectionEyebrow({
  children,
  trailing,
  trailingMuted,
}: {
  children: string;
  trailing?: string;
  trailingMuted?: boolean;
}) {
  const { type } = useResponsiveLayout();
  const labelSize = type(11);

  return (
    <View style={styles.eyebrowRow}>
      <Text
        style={[styles.eyebrow, { fontSize: labelSize, letterSpacing: 0.6 }]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
      >
        {children}
      </Text>
      {trailing ? (
        <Text
          style={[
            trailingMuted ? styles.eyebrowTrailingMuted : styles.eyebrowTrailing,
            { fontSize: labelSize, letterSpacing: trailingMuted ? 0 : 0.6 },
          ]}
          numberOfLines={1}
        >
          {trailing}
        </Text>
      ) : null}
    </View>
  );
}

export function LongevityScreen() {
  const { scale, type, leading, isCompact, isNarrow, isTight, cardPadding, contentWidth } =
    useResponsiveLayout();
  const isFirstAssessment = homeDemo.assessmentCount <= 1;
  const chartSeries = getHomeChartSeries();
  const assessmentCycle = useAssessmentCycle();
  const assessmentWindow = useAssessmentWindow();
  const heroRingSize = scale(isCompact ? 80 : 104);
  const promoStatSize = type(contentWidth < 340 ? 34 : isNarrow ? 40 : 52);
  const countdownSize = type(isTight ? 34 : 46);
  const promoPad = isTight ? Math.max(12, cardPadding - 4) : cardPadding;

  return (
    <View style={styles.screen}>
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.greeting, { fontSize: type(21), lineHeight: leading(type(21)) }]}>
          {homeDemo.firstName}, training today is training for{' '}
          <Text style={styles.greetingAccent}>your future</Text>.
        </Text>

        <View style={[styles.levelRow, { gap: scale(isTight ? 14 : 22) }]}>
          <LumHeroRing value={homeDemo.level} pct={homeDemo.levelPct} size={heroRingSize} />
          <View style={styles.levelCopy}>
            <Text style={[styles.levelTitle, { fontSize: type(30), lineHeight: leading(type(30), 1.12) }]}>
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

        {assessmentWindow.live ? (
          <AssessmentLiveCard
            window={assessmentWindow}
            kaletteReward={homeDemo.kaletteReward}
          />
        ) : (
          <LumenCard accent={lumen.coral} style={styles.nextCard}>
            <View style={styles.nextHeader}>
              <Text style={[styles.nextLabel, { fontSize: type(11) }]}>Next assessment</Text>
              <Text style={[styles.nextProgress, { fontSize: type(12) }]}>
                {assessmentCycle.cycleProgressPct}% through cycle
              </Text>
            </View>
            <View style={[styles.countdownRow, isTight && styles.countdownRowWrap]}>
              <Text
                style={[
                  styles.countdownNum,
                  { fontSize: countdownSize, lineHeight: leading(countdownSize, 1.08) },
                ]}
              >
                {assessmentCycle.weeksToAssessment}
              </Text>
              <Text style={[styles.countdownUnit, { fontSize: type(14) }]}>weeks</Text>
              <Text
                style={[
                  styles.countdownNum,
                  styles.countdownGap,
                  { fontSize: countdownSize, lineHeight: leading(countdownSize, 1.08) },
                ]}
              >
                {assessmentCycle.daysToAssessment}
              </Text>
              <Text style={[styles.countdownUnit, { fontSize: type(14) }]}>days</Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${assessmentCycle.cycleProgressPct}%` }]}
              />
            </View>
            <Text style={[styles.nextReward, { fontSize: type(13) }]}>
              Complete it to bank{' '}
              <Text style={styles.nextRewardAccent}>{homeDemo.kaletteReward} Kalettes</Text>.
            </Text>
          </LumenCard>
        )}

        {isFirstAssessment ? (
          <FirstAssessmentCard
            level={homeDemo.level}
            lifespanYears={homeDemo.lifespanYears}
            healthspanYears={homeDemo.healthspanYears}
          />
        ) : (
          <>
            <LumenCard style={styles.chartCard}>
              <SectionEyebrow trailing="5y outlook" trailingMuted>
                Health Years over time
              </SectionEyebrow>
              <TrendChartScroll pointCount={chartSeries.count} height={120}>
                {(width) => (
                  <HealthYearsTrendChart
                    width={width}
                    labels={chartSeries.labels}
                    lifespan={chartSeries.lifespan}
                    healthspan={chartSeries.healthspan}
                  />
                )}
              </TrendChartScroll>
              <View style={styles.legendRow}>
                <View style={styles.legendColumn}>
                  <LegendDot color={lumenPillar.cardio} name="Lifespan" value={`+${homeDemo.lifespanYears}y`} />
                  <LegendDot
                    color={lumenPillar.knowledge}
                    name="Healthspan"
                    value={`+${homeDemo.healthspanYears}y`}
                  />
                </View>
                <Text style={styles.levelTag}>at Level {homeDemo.level}</Text>
              </View>
            </LumenCard>

            <LumenCard style={styles.chartCard}>
              <SectionEyebrow trailing={`${chartSeries.count} CYCLES`}>
                Longevity Level over time
              </SectionEyebrow>
              <TrendChartScroll pointCount={chartSeries.count} height={130}>
                {(width) => (
                  <LongevityLevelTrendChart
                    width={width}
                    levels={chartSeries.levels}
                    labels={chartSeries.labels}
                  />
                )}
              </TrendChartScroll>
            </LumenCard>
          </>
        )}

        <View style={styles.quickStats}>
          <QuickStatPillar pillar="Cardio" level={homeDemo.pillarLevels.cardio} color={lumenPillar.cardio} />
          <QuickStatPillar pillar="Strength" level={homeDemo.pillarLevels.strength} color={lumenPillar.strength} />
          <QuickStatPillar pillar="Knowledge" level={homeDemo.pillarLevels.knowledge} color={lumenPillar.knowledge} />
        </View>

        <View style={styles.promo}>
          <LinearGradient
            colors={['rgba(204,250,125,0.14)', 'rgba(0,200,150,0.08)', 'rgba(234,243,228,0.04)']}
            locations={[0, 0.55, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={[styles.promoInner, { padding: promoPad }]}>
            <View style={styles.promoBadgeRow}>
              <Text style={[styles.promoBadge, { fontSize: type(10.5) }]}>New</Text>
              <View style={styles.promoRule} />
            </View>
            <View style={styles.promoMidRow}>
              <View style={styles.promoCopy}>
                <Text style={[styles.promoTitle, { fontSize: type(23), lineHeight: type(28) }]}>
                  Your <Text style={styles.promoTitleAccent}>Running Years</Text>
                </Text>
                <Text
                  style={[
                    styles.promoText,
                    { fontSize: type(13.5), lineHeight: Math.round(type(13.5) * 1.45) },
                  ]}
                >
                  See the good years you've got ahead — and the moments worth training for.
                </Text>
              </View>
              <View style={styles.promoStat}>
                <Text style={[styles.promoStatTilde, { fontSize: type(14) }]}>~</Text>
                <Text
                  style={[
                    styles.promoStatNum,
                    { fontSize: promoStatSize, lineHeight: leading(promoStatSize, 1.08) },
                  ]}
                >
                  {homeDemo.runningYearsAhead}
                </Text>
                <Text style={[styles.promoStatLabel, { fontSize: type(11) }]}>years ahead</Text>
              </View>
            </View>
            <LumenButton style={styles.promoButton}>Explore your Running Years</LumenButton>
          </View>
        </View>
        </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'transparent',
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
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
    width: '100%',
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
    flexShrink: 0,
    textAlign: 'right',
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
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
    width: '100%',
  },
  eyebrow: {
    ...sora('bold'),
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  eyebrowTrailing: {
    ...sora('bold'),
    textTransform: 'uppercase',
    color: lumen.lime,
    flexShrink: 0,
    textAlign: 'right',
  },
  eyebrowTrailingMuted: {
    ...sora('semibold'),
    textTransform: 'none',
    color: lumen.fgMuted,
    flexShrink: 0,
    textAlign: 'right',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
    width: '100%',
  },
  legendColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    flexShrink: 1,
  },
  levelTag: {
    ...sora('semibold'),
    fontSize: 11,
    color: lumen.fgMuted,
    flexShrink: 0,
    textAlign: 'right',
  },
  quickStats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 14,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
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
    position: 'relative',
  },
  promoInner: {
    width: '100%',
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
  promoMidRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    width: '100%',
  },
  promoCopy: {
    flex: 1,
    flexShrink: 1,
    minWidth: 120,
    paddingRight: 4,
  },
  promoTitle: {
    ...sora('extrabold'),
    fontSize: 23,
    lineHeight: 28,
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
    lineHeight: 20,
    color: 'rgba(234,243,228,0.65)',
    maxWidth: 220,
  },
  promoStat: {
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
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
    lineHeight: 13,
    color: lumen.fg,
    flexShrink: 0,
    maxWidth: 56,
  },
});
