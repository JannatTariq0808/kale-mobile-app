// Design: kale-mobile-design — KAAssessmentLiveCard (screens/KaleApp.jsx, lum-12b)

import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { LumenButton } from './LumenButton';
import { lumen, sora } from '../../theme';
import type { AssessmentWindowLive } from '../../utils/assessmentCycle';

type AssessmentLiveCardProps = {
  window: AssessmentWindowLive;
  quarterLabel: string;
  kaletteReward: number;
  onStartPress?: () => void;
};

function TimeUnit({
  value,
  unit,
  muted,
  valueSize,
  unitSize,
}: {
  value: number;
  unit: string;
  muted?: boolean;
  valueSize: number;
  unitSize: number;
}) {
  return (
    <View style={styles.timeUnit}>
      <Text
        style={[
          styles.timeValue,
          { fontSize: valueSize, lineHeight: valueSize },
          muted && styles.timeValueMuted,
        ]}
      >
        {String(value).padStart(2, '0')}
      </Text>
      <Text style={[styles.timeLabel, { fontSize: unitSize }]}>{unit}</Text>
    </View>
  );
}

function LiveBadge({ labelSize }: { labelSize: number }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.liveBadge}>
      <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
      <Text style={[styles.liveBadgeText, { fontSize: labelSize }]}>Assessment live</Text>
    </View>
  );
}

export function AssessmentLiveCard({
  window,
  quarterLabel,
  kaletteReward,
  onStartPress,
}: AssessmentLiveCardProps) {
  const { type } = useResponsiveLayout();
  const labelSize = type(10);
  const headlineSize = type(22);
  const timeSize = type(32);
  const timeUnitSize = type(9);
  const footerSize = type(10);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['rgba(0,200,150,0.10)', 'rgba(0,200,150,0.04)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <LiveBadge labelSize={labelSize} />
          <Text style={[styles.cycleLabel, { fontSize: type(11) }]}>{quarterLabel}</Text>
        </View>

        <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineSize * 1.15 }]}>
          Take your{' '}
          <Text style={[styles.headlineAccent, { fontSize: headlineSize * 1.05 }]}>
            assessment
          </Text>
          .
        </Text>

        <View style={styles.countdownRow}>
          <TimeUnit value={window.daysUntilClose} unit="days" valueSize={timeSize} unitSize={timeUnitSize} />
          <Text style={[styles.countdownSep, { fontSize: type(28) }]}>:</Text>
          <TimeUnit value={window.hoursUntilClose} unit="hrs" valueSize={timeSize} unitSize={timeUnitSize} />
          <Text style={[styles.countdownSep, { fontSize: type(28) }]}>:</Text>
          <TimeUnit value={window.minutesUntilClose} unit="min" valueSize={timeSize} unitSize={timeUnitSize} />
          <Text style={[styles.countdownSep, { fontSize: type(28) }]}>:</Text>
          <TimeUnit
            value={window.secondsUntilClose}
            unit="sec"
            muted
            valueSize={timeSize}
            unitSize={timeUnitSize}
          />
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${window.windowProgressPct}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressLabel, { fontSize: footerSize }]}>{window.openLabel}</Text>
          <Text style={[styles.progressLabel, { fontSize: footerSize }]}>{window.closeLabel}</Text>
        </View>

        <LumenButton onPress={onStartPress} style={styles.cta}>
          Start assessment
        </LumenButton>

        <Text style={[styles.reward, { fontSize: type(13) }]}>
          Complete it to bank{' '}
          <Text style={styles.rewardAccent}>{kaletteReward} Kalettes</Text>.
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: lumen.mint,
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
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: lumen.mint,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: lumen.bgDark,
  },
  liveBadgeText: {
    ...sora('extrabold'),
    color: lumen.bgDark,
    letterSpacing: 1.4,
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
    marginBottom: 14,
  },
  headlineAccent: {
    fontWeight: '800',
    color: lumen.mint,
    fontStyle: 'italic',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  countdownSep: {
    ...sora('extrabold'),
    color: lumen.fgFaint,
    letterSpacing: -0.8,
    marginHorizontal: 4,
    lineHeight: 32,
  },
  timeUnit: {
    flex: 1,
    alignItems: 'center',
  },
  timeValue: {
    ...sora('extrabold'),
    color: lumen.fg,
    letterSpacing: -1.2,
    fontVariant: ['tabular-nums'],
  },
  timeValueMuted: {
    color: lumen.fgMuted,
  },
  timeLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginTop: 6,
  },
  progressTrack: {
    marginTop: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,200,150,0.15)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: lumen.mint,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: 8,
  },
  progressLabel: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 0.8,
    flexShrink: 1,
  },
  cta: {
    marginTop: 16,
    height: 48,
  },
  reward: {
    ...sora('semibold'),
    color: lumen.fg,
    textAlign: 'center',
    marginTop: 12,
  },
  rewardAccent: {
    ...sora('extrabold'),
    color: lumen.mint,
    fontVariant: ['tabular-nums'],
  },
});
