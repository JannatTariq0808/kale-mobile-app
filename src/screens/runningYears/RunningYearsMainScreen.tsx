import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { FaqAccordion } from '../../components/lumen/FaqAccordion';
import { LumenButton } from '../../components/lumen/LumenButton';
import { LumenCard } from '../../components/lumen/LumenCard';
import { DraggableAgeSlider } from '../../components/runningYears/DraggableAgeSlider';
import { RunYearsTrajectoryChart } from '../../components/runningYears/RunYearsTrajectoryChart';
import { Vo2MaxSlider } from '../../components/runningYears/Vo2MaxSlider';
import { useAuthSession } from '../../hooks/useAuthSession';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { useRunningYearsQuestions } from '../../hooks/useRunningYearsQuestions';
import type { LongevityStackParamList } from '../../navigation/LongevityStackNavigator';
import {
  activityGerund,
  sportForGoalId,
  stillActiveLabel,
  yearsProductTitleLower,
} from '../../config/runningYearsGoals';
import { fetchRunningYearsProjection } from '../../services/runningYears/fetchRunningYearsProjection';
import { readRunningYearsGoal } from '../../services/runningYears/runningYearsStorage';
import type { RunningYearsProjection } from '../../types/runningYears';
import {
  buildHeroSubcopy,
  buildTrajectory,
  computeGapYears,
  computeOnTrack,
  computeRunningYears,
  estimatedConfidenceNote,
  formatGapYearsCard,
  formatRunningYearsHero,
  THRESHOLD_STILL_RUNNING,
} from '../../utils/runningYearsProjection';
import { lumen, sora } from '../../theme';

type Props = NativeStackScreenProps<LongevityStackParamList, 'RunningYearsMain'>;

export function RunningYearsMainScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthSession();
  const { type } = useResponsiveLayout();
  const heroValueSize = type(84);
  const heroLabelSize = type(17);
  const faqState = useRunningYearsQuestions();
  const [projection, setProjection] = useState<RunningYearsProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [overrideVo2, setOverrideVo2] = useState<number | null>(null);
  const didInitialFocus = useRef(false);

  const reload = useCallback(async (silent = false) => {
    if (!user?.uid) return;
    if (!silent) setLoading(true);
    try {
      const goal = await readRunningYearsGoal(user.uid);
      const data = await fetchRunningYearsProjection(user.uid, goal ?? undefined);
      setProjection(data);
      if (data.vo2max != null) {
        setOverrideVo2(Math.round(data.vo2max));
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useFocusEffect(
    useCallback(() => {
      if (!didInitialFocus.current) {
        didInitialFocus.current = true;
        return;
      }
      void reload(true);
    }, [reload]),
  );

  const live = useMemo(() => {
    if (!projection) return null;
    const vo2 =
      overrideVo2 ??
      (projection.vo2max != null ? Math.round(projection.vo2max) : 42);
    const declining = projection.screenState === 'declining';
    const { runningYears, activeUntilAge } = computeRunningYears(
      vo2,
      projection.age,
      declining,
    );
    const gapYears = computeGapYears(vo2, projection.age, declining);
    const trajectory = buildTrajectory(vo2, projection.age, projection.goalAge, declining);
    const track = computeOnTrack(
      projection.goalAge,
      vo2,
      projection.age,
      activeUntilAge,
      declining,
    );
    return {
      vo2,
      runningYears,
      activeUntilAge,
      gapYears,
      trajectory,
      onTrack: track.onTrack,
      yearsToSpare: track.yearsToSpare,
    };
  }, [overrideVo2, projection]);

  if (loading || !projection || !live) {
    return (
      <View style={[styles.screen, styles.loader]}>
        <ActivityIndicator color={lumen.lime} size="large" />
      </View>
    );
  }

  const heroProjection = {
    screenState: projection.screenState,
    runningYears: live.runningYears,
    runningYearsLow: projection.runningYearsLow,
    runningYearsHigh: projection.runningYearsHigh,
  };
  // When the user overrides VO₂, show the live single number (not the estimated band).
  const hero =
    overrideVo2 != null &&
    projection.vo2max != null &&
    Math.round(overrideVo2) !== Math.round(projection.vo2max)
      ? { value: String(live.runningYears), showTilde: true, showEstimatedBand: false }
      : formatRunningYearsHero(heroProjection);

  const gapCard = formatGapYearsCard(live.gapYears);
  const sport = sportForGoalId(projection.goalId);
  const gerund = activityGerund(sport);
  const productLower = yearsProductTitleLower(sport);
  const stillLabel = stillActiveLabel(sport);
  const heroSubcopy = buildHeroSubcopy(
    projection.age,
    live.activeUntilAge,
    live.runningYears,
    sport,
  );
  const confidenceNote = estimatedConfidenceNote(projection);
  const goalAge = projection.goalAge;
  const yearsUntilGoal = Math.max(0, goalAge - projection.age);
  const onTrack = live.onTrack === 'on_track';
  const yearsToSpare = live.yearsToSpare;

  const faqItems = faqState.items.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => navigation.navigate('Home')} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={lumen.fg} />
        </Pressable>
      </View>

      <ScreenScroll
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 16) + 24 }]}
      >
        <Text style={styles.eyebrow}>YOUR RUNNING YEARS</Text>

        <View style={styles.heroRow}>
          {hero.showTilde ? (
            <Text style={[styles.heroTilde, { fontSize: type(30), lineHeight: type(36) }]}>~</Text>
          ) : null}
          <Text
            style={[
              styles.heroValue,
              {
                fontSize: heroValueSize,
                lineHeight: Math.ceil(heroValueSize * 1.12),
                includeFontPadding: false,
              },
            ]}
          >
            {hero.value}
          </Text>
          <Text
            style={[
              styles.heroLabel,
              { fontSize: heroLabelSize, lineHeight: type(22) },
            ]}
          >
            {hero.showEstimatedBand
              ? `${productLower} ahead (estimated)`
              : `strong ${productLower} ahead`}
          </Text>
        </View>

        <Text style={styles.heroCopy}>{heroSubcopy}</Text>

        {confidenceNote ? <Text style={styles.confidenceNote}>{confidenceNote}</Text> : null}

        <View style={styles.statRow}>
          <View style={styles.statPill}>
            <Text style={styles.statValue}>{live.vo2}</Text>
            <Text style={styles.statUnit}>VO₂max</Text>
          </View>
          {projection.percentile != null ? (
            <View style={styles.statPill}>
              <Text style={styles.statValue}>{projection.percentile}th</Text>
              <Text style={styles.statUnit}>percentile</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalEyebrow}>YOUR GOAL</Text>
            <Pressable onPress={() => navigation.replace('RunningYearsGoal')} style={styles.changeBtn}>
              <Text style={styles.changeLink}>Change</Text>
            </Pressable>
          </View>
          <Text style={styles.goalTitle}>{projection.goalLabel}</Text>
          <Text style={styles.goalMeta}>
            at age {goalAge} · {yearsUntilGoal} years from now
          </Text>
          <View style={styles.goalSliderWrap}>
            <DraggableAgeSlider value={goalAge} labelMode="main-fixed" variant="main" readOnly />
          </View>
          <View style={[styles.statusPill, !onTrack && styles.statusPillStretch]}>
            {onTrack ? <Ionicons name="checkmark-circle" size={13} color="#3FD08B" /> : null}
            <Text style={[styles.statusPillText, !onTrack && styles.statusPillTextStretch]}>
              {onTrack ? 'On track — with years to spare' : 'A stretch — dial it in'}
            </Text>
          </View>
          <Text style={styles.goalCopy}>
            {onTrack ? (
              <>
                You&apos;re on track to still be {gerund} at{' '}
                <Text style={styles.accent}>{goalAge}</Text> — about{' '}
                <Text style={styles.accent}>{yearsToSpare} years</Text> to spare.
              </>
            ) : (
              <>
                You&apos;re aiming for <Text style={styles.accent}>{goalAge}</Text> — about{' '}
                <Text style={styles.accent}>{yearsToSpare} years</Text> to build back.
              </>
            )}
          </Text>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>If you keep training</Text>
            <Text style={styles.chartSubtitle}>fitness vs. age</Text>
          </View>

          <Vo2MaxSlider value={live.vo2} onChange={setOverrideVo2} />

          <RunYearsTrajectoryChart
            trajectory={live.trajectory}
            goalAge={projection.goalAge}
            vo2Now={live.vo2}
            declining={projection.screenState === 'declining'}
            stillActiveLabel={stillLabel}
          />
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={styles.legendKeep} />
              <Text style={styles.legendKeepText}>Keep training</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendNone} />
              <Text style={styles.legendNoneText}>Do nothing</Text>
            </View>
          </View>
          <Text style={styles.chartExplainer}>
            VO₂max holds steady until your 30s, then falls with age — training slows that drop to
            about <Text style={styles.chartExplainerStrong}>0.5% a year</Text> vs roughly{' '}
            <Text style={styles.chartExplainerStrong}>10% a decade</Text> if you stop. {stillLabel}{' '}
            means staying above {THRESHOLD_STILL_RUNNING} ml/kg/min — sport stays comfortable.
          </Text>
          <View style={styles.gapInline}>
            {gapCard.value ? <Text style={styles.gapValue}>{gapCard.value}</Text> : null}
            <Text style={styles.gapCopy}>
              {gapCard.body}
              <Text style={styles.accent}>{gapCard.accent}</Text>
            </Text>
          </View>
        </View>

        {projection.screenState === 'declining' ? (
          <LumenCard>
            <Text style={styles.decliningTitle}>A dial you control</Text>
            <Text style={styles.decliningCopy}>
              Your projection dipped this quarter. An easy{' '}
              {sport === 'cycling' ? 'ride' : 'run'} week can put years back within reach.
            </Text>
            <LumenButton onPress={() => navigation.navigate('Home')}>
              Build my easy-{sport === 'cycling' ? 'ride' : 'run'} week
            </LumenButton>
          </LumenCard>
        ) : null}

        <View style={styles.faqSection}>
          <Text style={styles.faqEyebrow}>GOOD TO KNOW</Text>
          {faqState.loading ? (
            <ActivityIndicator color={lumen.lime} />
          ) : (
            <FaqAccordion items={faqItems} />
          )}
        </View>
      </ScreenScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  loader: { alignItems: 'center', justifyContent: 'center' },
  topBar: {
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { padding: 6, marginLeft: -6 },
  content: { paddingTop: 4, gap: 0, paddingHorizontal: 2 },
  eyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 0,
    overflow: 'visible',
  },
  heroTilde: { ...sora('bold'), color: lumen.fgMuted, letterSpacing: -0.5, paddingBottom: 10 },
  heroValue: {
    ...sora('bold'),
    color: lumen.lime,
    letterSpacing: -2.5,
    fontVariant: ['tabular-nums'],
    overflow: 'visible',
    paddingTop: 4,
  },
  heroLabel: {
    ...sora('bold'),
    color: lumen.fg,
    flex: 1,
    maxWidth: 148,
    paddingBottom: 12,
  },
  heroCopy: {
    ...sora('regular'),
    color: lumen.fg,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 330,
  },
  confidenceNote: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
    maxWidth: 330,
  },
  accent: { color: lumen.lime, fontWeight: '800' },
  statRow: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' },
  statPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: lumen.hairline,
    backgroundColor: 'rgba(234,243,228,0.06)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValue: { ...sora('bold'), color: lumen.lime, fontSize: 13 },
  statUnit: { ...sora('regular'), color: lumen.fgMuted, fontSize: 11 },
  goalCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(204,250,125,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.22)',
    gap: 0,
    overflow: 'visible',
  },
  goalHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  goalEyebrow: { ...sora('bold'), color: lumen.lime, fontSize: 10.5, letterSpacing: 1.6 },
  changeBtn: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: lumen.hairline,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeLink: { ...sora('regular'), color: lumen.fg, fontSize: 12 },
  goalTitle: {
    ...sora('bold'),
    color: lumen.fg,
    fontSize: 19,
    lineHeight: 24,
    letterSpacing: -0.3,
    marginTop: 6,
  },
  goalMeta: { ...sora('regular'), color: lumen.fgMuted, fontSize: 12.5, marginTop: 4 },
  goalSliderWrap: { marginTop: 16 },
  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0,200,150,0.16)',
  },
  statusPillStretch: { backgroundColor: 'rgba(245,233,78,0.16)' },
  statusPillText: { ...sora('bold'), color: '#3FD08B', fontSize: 12 },
  statusPillTextStretch: { color: lumen.yellow },
  goalCopy: { ...sora('regular'), color: lumen.fg, fontSize: 13, lineHeight: 20, marginTop: 12 },
  chartCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    gap: 0,
    overflow: 'visible',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartTitle: { ...sora('bold'), color: lumen.fg, fontSize: 13, fontWeight: '700' },
  chartSubtitle: { ...sora('regular'), color: lumen.fgMuted, fontSize: 11, fontWeight: '600' },
  chartLegend: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendKeep: { width: 14, height: 3, borderRadius: 2, backgroundColor: lumen.lime },
  legendKeepText: { ...sora('regular'), color: lumen.fg, fontSize: 11.5 },
  legendNone: { width: 14, height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: lumen.track },
  legendNoneText: { ...sora('regular'), color: lumen.fgMuted, fontSize: 11.5 },
  chartExplainer: {
    ...sora('regular'),
    color: lumen.fgMuted,
    fontSize: 11.5,
    lineHeight: 17,
    marginTop: 12,
  },
  chartExplainerStrong: { color: lumen.fg, fontWeight: '700' },
  gapInline: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(204,250,125,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.2)',
  },
  gapValue: {
    ...sora('bold'),
    color: lumen.lime,
    fontSize: 30,
    letterSpacing: -1,
    lineHeight: 36,
    flexShrink: 0,
    paddingTop: 2,
  },
  gapCopy: {
    ...sora('regular'),
    color: lumen.fg,
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
    minWidth: 0,
    paddingBottom: 2,
  },
  decliningTitle: { ...sora('bold'), color: lumen.fg, fontSize: 18 },
  decliningCopy: { ...sora('regular'), color: lumen.fgMuted, fontSize: 14, lineHeight: 20, marginBottom: 8 },
  faqSection: {
    marginTop: 18,
    gap: 12,
    paddingBottom: 8,
  },
  faqEyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    fontSize: 11,
    letterSpacing: 1.2,
  },
});
