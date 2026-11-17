// Design: Lumen for IP — Goals · with a coach (screens/LumenIP.jsx KaleIPGoalsTab)

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '../../components/icons/Ionicons';
import { IPGhostButton } from '../../components/ip/IPGhostButton';
import { IPKicker } from '../../components/ip/IPKicker';
import { ScreenScroll } from '../../components/layout/ScreenScroll';
import { LumenCard } from '../../components/lumen/LumenCard';
import { LumenHeader } from '../../components/lumen/LumenHeader';
import { LumenRuleCaption } from '../../components/lumen/LumenRuleCaption';
import { IP_COACH_NAME } from '../../config/incomeProtection';
import { useAppNow } from '../../hooks/useAppNow';
import { useGoals } from '../../hooks/useGoals';
import { useHomeLongevityData } from '../../hooks/useHomeLongevityData';
import type { GoalsStackParamList } from '../../navigation/GoalsStackNavigator';
import { lumen, lumenPillar, sora } from '../../theme';
import { headlineTextStyle } from '../../theme/textMetrics';
import type { CoachGoalPillar, QuarterGoal } from '../../types/goals';
import { buildPolicyYear, formatLongDate } from '../../utils/ipPolicy';
import { goalTargetLabel, GOAL_TITLES } from './goalCopy';

type Props = NativeStackScreenProps<GoalsStackParamList, 'GoalsHome'>;

const COACH_PHOTO = require('../../../assets/coach-alex.jpg');

const PILLAR_COLOR: Record<CoachGoalPillar, string> = {
  cardio: lumenPillar.cardio,
  strength: lumenPillar.strength,
  knowledge: lumenPillar.knowledge,
  health: lumen.yellow,
};

function SectionLabel({ children }: { children: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionLabel}>{children}</Text>
      <View style={styles.sectionRule} />
    </View>
  );
}

function QuarterGoalCard({ goal, level }: { goal: QuarterGoal; level: number }) {
  const baseLevel = goal.levelAtSet ?? level;
  return (
    <View style={styles.goalCard}>
      <View style={styles.goalHead}>
        <Text style={styles.goalTitle}>{GOAL_TITLES[goal.type]}</Text>
        <Text style={styles.goalLevel}>{goalTargetLabel(goal.type, baseLevel)}</Text>
      </View>
      {goal.how ? <Text style={styles.goalHow}>“{goal.how}”</Text> : null}
      <Text style={styles.goalMeta}>
        {goal.window ? `For your ${goal.window} assessment` : 'For your next assessment'}
      </Text>
    </View>
  );
}

export function GoalsScreen({ navigation }: Props) {
  const { goals, loading, refresh } = useGoals();
  const { level } = useHomeLongevityData();
  const now = useAppNow(false);
  const nextWindow = useMemo(() => buildPolicyYear(now, null)[1]?.window ?? null, [now]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const { quarterGoal, coachGoals } = goals;
  const coachName = coachGoals?.coachName ?? IP_COACH_NAME;

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <LumenHeader />
        <ScreenScroll contentContainerStyle={styles.scrollContent}>
          <IPKicker>Goals</IPKicker>
          <Text style={[headlineTextStyle(32, lumen.fg), styles.title]}>
            Your <Text style={styles.titleAccent}>goals</Text>
          </Text>

          <SectionLabel>This quarter</SectionLabel>
          {loading && !quarterGoal ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator color={lumen.mint} />
            </View>
          ) : (
            <View style={styles.stack}>
              {quarterGoal ? (
                <QuarterGoalCard goal={quarterGoal} level={level} />
              ) : (
                <Text style={styles.body}>
                  {nextWindow
                    ? `No goal yet. Pick one for your ${nextWindow} assessment.`
                    : 'No goal yet. Pick one for your next assessment.'}
                </Text>
              )}
              <IPGhostButton onPress={() => navigation.navigate('AddGoal')}>
                {quarterGoal ? 'Change my goal' : 'Add a goal'}
              </IPGhostButton>
            </View>
          )}

          <Pressable
            onPress={() => navigation.navigate('Coaching')}
            accessibilityRole="button"
            accessibilityLabel={`Longevity coaching with ${IP_COACH_NAME}`}
            style={({ pressed }) => [styles.coachCardWrap, pressed && styles.pressed]}
          >
            <LumenCard padding={18}>
              <View style={styles.coachRow}>
                <Image source={COACH_PHOTO} style={styles.coachPhoto} accessibilityIgnoresInvertColors />
                <View style={styles.coachText}>
                  <Text style={styles.coachTitle}>Longevity coaching with {IP_COACH_NAME}</Text>
                  <Text style={styles.coachSub}>
                    Training, recovery and a health screening plan for you.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={lumen.fg} />
              </View>
            </LumenCard>
          </Pressable>

          <SectionLabel>Long term, with your coach</SectionLabel>
          {coachGoals ? (
            <View style={styles.stack}>
              {coachGoals.goals.map((goal, index) => (
                <LumenCard key={`${goal.title}-${index}`} padding={16}>
                  <View style={styles.longRow}>
                    <View style={[styles.longDot, { backgroundColor: PILLAR_COLOR[goal.pillar] }]} />
                    <View style={styles.longText}>
                      <Text style={styles.longTitle}>{goal.title}</Text>
                      {goal.note ? (
                        <View style={styles.noteWrap}>
                          <LumenRuleCaption align="left" maxWidth={290} size={13.5}>
                            {goal.note}
                          </LumenRuleCaption>
                        </View>
                      ) : null}
                    </View>
                  </View>
                </LumenCard>
              ))}
              <Text style={styles.setWith}>
                {coachGoals.setAt
                  ? `Set with ${coachName}, ${formatLongDate(coachGoals.setAt).replace(/ \d{4}$/, '')}`
                  : `Set with ${coachName}`}
              </Text>
            </View>
          ) : (
            <Text style={styles.body}>
              Long term goals appear here once you’ve set them with a coach.
            </Text>
          )}
        </ScreenScroll>
      </View>
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
  content: {
    flex: 1,
    zIndex: 2,
    width: '100%',
  },
  scrollContent: {
    paddingTop: 16,
  },
  title: {
    letterSpacing: -1,
    marginTop: 12,
  },
  titleAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionLabel: {
    ...sora('extrabold'),
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.44,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: lumen.hairline,
  },
  loaderWrap: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  stack: {
    gap: 10,
  },
  body: {
    ...sora('semibold'),
    fontSize: 14.5,
    lineHeight: 21,
    color: lumen.fgMuted,
  },
  goalCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.4)',
    backgroundColor: 'rgba(204,250,125,0.08)',
  },
  goalHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 10,
  },
  goalTitle: {
    ...sora('extrabold'),
    flexShrink: 1,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.17,
    color: lumen.fg,
  },
  goalLevel: {
    ...sora('extrabold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: lumen.lime,
  },
  goalHow: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 20,
    color: lumen.fg,
    marginTop: 12,
  },
  goalMeta: {
    ...sora('semibold'),
    fontSize: 12.5,
    lineHeight: 18,
    color: lumen.fgMuted,
    marginTop: 12,
  },
  coachCardWrap: {
    marginTop: 18,
  },
  pressed: {
    opacity: 0.85,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  coachPhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(204,250,125,0.5)',
  },
  coachText: {
    flex: 1,
  },
  coachTitle: {
    ...sora('extrabold'),
    fontSize: 16,
    lineHeight: 21,
    color: lumen.fg,
  },
  coachSub: {
    ...sora('semibold'),
    fontSize: 12.5,
    lineHeight: 17.5,
    color: lumen.fgMuted,
    marginTop: 3,
  },
  longRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  longDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
  },
  longText: {
    flex: 1,
  },
  longTitle: {
    ...sora('extrabold'),
    fontSize: 15.5,
    lineHeight: 20,
    color: lumen.fg,
  },
  noteWrap: {
    marginTop: 10,
  },
  setWith: {
    ...sora('semibold'),
    fontSize: 12,
    lineHeight: 16,
    color: lumen.fgMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
