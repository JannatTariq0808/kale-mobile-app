import { useCallback, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { useAssessmentCycle } from '../hooks/useAssessmentCycle';
import { useAssessmentWindow } from '../hooks/useAssessmentWindow';
import { useHomeLongevityData } from '../hooks/useHomeLongevityData';
import { useKalettesRewards } from '../hooks/useKalettesRewards';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { AssessmentLiveCard } from '../components/lumen/AssessmentLiveCard';
import { AssessmentQuarterCompleteCard } from '../components/lumen/AssessmentQuarterCompleteCard';
import { FirstAssessmentCard } from '../components/lumen/FirstAssessmentCard';
import { HealthYearsTrendChart } from '../components/lumen/HealthYearsTrendChart';
import { LegendDot, QuickStatPillar } from '../components/lumen/HomeMetrics';
import { LongevityLevelTrendChart } from '../components/lumen/LongevityLevelTrendChart';
import { LumHeroRing } from '../components/lumen/LumHeroRing';
import { LumenCard } from '../components/lumen/LumenCard';
import { LumenHeader } from '../components/lumen/LumenHeader';
import { TrendChartScroll } from '../components/lumen/TrendChartScroll';
import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { startQuarterlyAssessmentFromHome } from '../services/assessment/startQuarterlyAssessment';
import { getAssessmentQuarterDisplay } from '../utils/assessmentCycle';
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
  const home = useHomeLongevityData();
  const homeRefresh = home.refresh;
  const didInitialFocus = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!didInitialFocus.current) {
        didInitialFocus.current = true;
        return;
      }
      homeRefresh();
    }, [homeRefresh]),
  );
  const isFirstAssessment = home.assessmentCount <= 1;
  const chartSeries = home.chartSeries;
  const assessmentCycle = useAssessmentCycle();
  const assessmentWindow = useAssessmentWindow();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const quarterLabel = getAssessmentQuarterDisplay();
  const kalettesRewards = useKalettesRewards();
  const handleStartAssessment = useCallback(() => {
    void startQuarterlyAssessmentFromHome(navigation);
  }, [navigation]);
  const kaletteReward = kalettesRewards.hasQuote
    ? kalettesRewards.pendingKalettes || kalettesRewards.monthlyKalettes
    : Math.round(home.level * 81);
  const heroRingSize = scale(isCompact ? 80 : 104);
  const countdownSize = type(isTight ? 34 : 46);

  if (home.loading) {
    return (
      <View style={styles.screen}>
        <LumenHeader />
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={lumen.lime} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <LumenHeader />

      <ScreenScroll contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.greeting, { fontSize: type(21), lineHeight: leading(type(21)) }]}>
          {home.firstName}, training today is training for{' '}
          <Text style={styles.greetingAccent}>your future</Text>.
        </Text>

        <View style={[styles.levelRow, { gap: scale(isTight ? 14 : 22) }]}>
          <LumHeroRing value={home.level} pct={home.levelPct} size={heroRingSize} />
          <View style={styles.levelCopy}>
            <Text style={[styles.levelTitle, { fontSize: type(30), lineHeight: leading(type(30), 1.12) }]}>
              Level <Text style={styles.levelTitleAccent}>{home.level}</Text>
            </Text>
            <Text style={[styles.levelSubtitle, { fontSize: type(13) }]}>Your Longevity Level</Text>
            {home.showTrend && home.trendDelta != null ? (
              <View style={styles.trendChip}>
                <Ionicons
                  name={home.trendDelta > 0 ? 'arrow-up' : 'arrow-down'}
                  size={11}
                  color={home.trendDelta > 0 ? lumen.mint : lumen.coral}
                />
                <Text
                  style={[
                    styles.trendChipText,
                    { fontSize: type(12), color: home.trendDelta > 0 ? lumen.mint : lumen.coral },
                  ]}
                >
                  {home.trendDelta > 0 ? `+${home.trendDelta}` : home.trendDelta} this cycle
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.quickStats}>
          <QuickStatPillar pillar="Cardio" level={home.pillarLevels.cardio} color={lumenPillar.cardio} />
          <QuickStatPillar pillar="Strength" level={home.pillarLevels.strength} color={lumenPillar.strength} />
          <QuickStatPillar pillar="Knowledge" level={home.pillarLevels.knowledge} color={lumenPillar.knowledge} />
        </View>

        {assessmentWindow.live ? (
          home.completedAssessmentThisQuarter ? (
            <AssessmentQuarterCompleteCard
              window={assessmentWindow}
              quarterLabel={quarterLabel}
              pendingKalettes={
                kalettesRewards.hasQuote ? kalettesRewards.pendingKalettes : undefined
              }
            />
          ) : (
            <AssessmentLiveCard
              window={assessmentWindow}
              quarterLabel={quarterLabel}
              kaletteReward={kaletteReward}
              onStartPress={handleStartAssessment}
            />
          )
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
              {home.completedAssessmentThisQuarter ? (
                <>
                  Assessment done this quarter. Next window opens soon — pending Kalettes bank then.
                </>
              ) : (
                <>
                  Complete it to bank{' '}
                  <Text style={styles.nextRewardAccent}>{kaletteReward} Kalettes</Text>.
                </>
              )}
            </Text>
          </LumenCard>
        )}

        {isFirstAssessment ? (
          <FirstAssessmentCard
            level={home.level}
            lifespanYears={home.lifespanYears}
            healthspanYears={home.healthspanYears}
          />
        ) : chartSeries ? (
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
                  <LegendDot color={lumenPillar.cardio} name="Lifespan" value={`+${home.lifespanYears}y`} />
                  <LegendDot
                    color={lumenPillar.knowledge}
                    name="Healthspan"
                    value={`+${home.healthspanYears}y`}
                  />
                </View>
                <Text style={styles.levelTag}>at Level {home.level}</Text>
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
        ) : null}
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
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
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
});
