import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import {
  activityGerund,
  sportForGoalId,
  yearsProductTitle,
  yearsProductTitleLower,
  type RunningYearsSport,
} from '../../config/runningYearsGoals';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LumenButton } from '../lumen/LumenButton';
import { lumen, sora } from '../../theme';

type RunningYearsPromoCardProps = {
  runningYears: number;
  source: 'projection' | 'estimate';
  hasDevice: boolean;
  goalSet: boolean;
  goalId?: string | null;
  onPress: () => void;
};

export function RunningYearsPromoCard({
  runningYears,
  source,
  hasDevice,
  goalSet,
  goalId,
  onPress,
}: RunningYearsPromoCardProps) {
  const { type } = useResponsiveLayout();
  const sport: RunningYearsSport = sportForGoalId(goalId);
  const productTitle = yearsProductTitle(sport);
  const productLower = yearsProductTitleLower(sport);
  const gerund = activityGerund(sport);
  const showInvite = !hasDevice || !goalSet;
  const ctaLabel = goalSet ? `Explore your ${productTitle}` : `Set your ${productTitle} goal`;

  const subtitle = showInvite
    ? `Connect a tracker and set your goal to see your personal ${productLower}.`
    : source === 'projection'
      ? `Based on your age and fitness data — the years you're on track to keep ${gerund}.`
      : "See the good years you've got ahead — and the moments worth training for.";

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(204,250,125,0.14)', 'rgba(0,200,150,0.08)', 'rgba(234,243,228,0.04)']}
        locations={[0, 0.55, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.badgeRow}>
          <Text style={[styles.badgeText, { fontSize: type(10.5) }]}>NEW</Text>
          <View style={styles.badgeRule} />
        </View>

        <View style={styles.body}>
          <View style={styles.copyCol}>
            <Text style={[styles.title, { fontSize: type(23), lineHeight: type(25) }]}>
              Your <Text style={styles.titleAccent}>{productTitle}</Text>
            </Text>
            <Text style={[styles.subtitle, { fontSize: type(13.5), lineHeight: type(20) }]}>
              {subtitle}
            </Text>
          </View>

          <View style={styles.metricCol}>
            <Text style={[styles.tilde, { fontSize: type(14), lineHeight: type(18) }]}>~</Text>
            <Text
              style={[
                styles.metricValue,
                {
                  fontSize: type(52),
                  lineHeight: Math.ceil(type(52) * 1.15),
                  includeFontPadding: false,
                },
              ]}
            >
              {runningYears}
            </Text>
            <Text style={[styles.metricLabel, { fontSize: type(11), lineHeight: type(14) }]}>
              years{'\n'}ahead
            </Text>
          </View>
        </View>

        <LumenButton tone="lime" onPress={onPress} style={styles.cta}>
          {ctaLabel}
        </LumenButton>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    marginBottom: 14,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(204,250,125,0.28)',
    gap: 0,
    overflow: 'visible',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  badgeText: {
    ...sora('bold'),
    color: lumen.lime,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  badgeRule: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(204,250,125,0.25)',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  copyCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...sora('bold'),
    color: lumen.fg,
    letterSpacing: -0.6,
  },
  titleAccent: {
    color: lumen.lime,
  },
  subtitle: {
    ...sora('bold'),
    color: lumen.fgMuted,
    marginTop: 8,
    maxWidth: 220,
  },
  metricCol: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    flexShrink: 0,
    overflow: 'visible',
    paddingTop: 4,
  },
  tilde: {
    ...sora('bold'),
    color: lumen.fgMuted,
    paddingBottom: 4,
  },
  metricValue: {
    ...sora('bold'),
    color: lumen.lime,
    letterSpacing: -1.5,
    fontVariant: ['tabular-nums'],
    overflow: 'visible',
  },
  metricLabel: {
    ...sora('bold'),
    color: lumen.fg,
    maxWidth: 56,
    paddingBottom: 6,
  },
  cta: {
    marginTop: 18,
    height: 50,
  },
});
