import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';
import type { AssessmentWindowLive } from '../../utils/assessmentCycle';
import { formatAssessmentDate, getNextAssessmentWindowStart } from '../../utils/assessmentCycle';

type AssessmentQuarterCompleteCardProps = {
  window: AssessmentWindowLive;
  quarterLabel: string;
  pendingKalettes?: number;
};

export function AssessmentQuarterCompleteCard({
  window,
  quarterLabel,
  pendingKalettes,
}: AssessmentQuarterCompleteCardProps) {
  const { type } = useResponsiveLayout();
  const nextOpen = formatAssessmentDate(getNextAssessmentWindowStart());

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(204,250,125,0.10)', 'rgba(0,200,150,0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.doneBadge}>
            <Ionicons name="checkmark-circle" size={14} color={lumen.bgDark} />
            <Text style={[styles.doneBadgeText, { fontSize: type(10) }]}>Done this quarter</Text>
          </View>
          <Text style={[styles.cycleLabel, { fontSize: type(11) }]}>{quarterLabel}</Text>
        </View>

        <Text style={[styles.headline, { fontSize: type(22), lineHeight: type(22) * 1.15 }]}>
          You've completed your{' '}
          <Text style={[styles.headlineAccent, { fontSize: type(22) * 1.05 }]}>assessment</Text>.
        </Text>

        <Text style={[styles.body, { fontSize: type(14), lineHeight: type(14) * 1.45 }]}>
          One assessment per quarter — including onboarding. Your next window opens {nextOpen}.
        </Text>

        {pendingKalettes != null && pendingKalettes > 0 ? (
          <Text style={[styles.reward, { fontSize: type(13) }]}>
            <Text style={styles.rewardAccent}>{pendingKalettes.toLocaleString('en-GB')} Kalettes</Text>{' '}
            waiting to bank at that next on-time assessment.
          </Text>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(204,250,125,0.35)',
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: lumen.lime,
  },
  doneBadgeText: {
    ...sora('extrabold'),
    color: lumen.bgDark,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  cycleLabel: {
    ...sora('semibold'),
    color: lumen.fgMuted,
    letterSpacing: 0.4,
  },
  headline: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  headlineAccent: {
    fontWeight: '800',
    color: lumen.lime,
    fontStyle: 'italic',
  },
  body: {
    ...sora('semibold'),
    color: 'rgba(234,243,228,0.72)',
  },
  reward: {
    ...sora('semibold'),
    color: lumen.fg,
    marginTop: 14,
  },
  rewardAccent: {
    ...sora('extrabold'),
    color: lumen.lime,
    fontVariant: ['tabular-nums'],
  },
});
