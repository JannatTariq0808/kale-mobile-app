import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, lumenPillar, sora } from '../../theme';

type Pillar = keyof typeof lumenPillar;

type RelativePerformanceGaugeProps = {
  value: number;
  gender: string;
  ageRange: string;
  pillar?: Pillar;
};

/** Design: K3RPGauge — lum-18 KaleFitnessStrengthLumen */
export function RelativePerformanceGauge({
  value,
  gender,
  ageRange,
  pillar = 'strength',
}: RelativePerformanceGaugeProps) {
  const { type } = useResponsiveLayout();
  const color = lumenPillar[pillar];
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { fontSize: type(10) }]}>Relative performance</Text>
        <Text style={[styles.rpValue, { fontSize: type(16), color }]}>RP {clamped}%</Text>
      </View>

      <View style={styles.trackWrap}>
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', `${color}80`, color]}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.trackBar}
        />
        {[25, 50, 75].map((p) => (
          <View key={p} style={[styles.tick, { left: `${p}%` }]} />
        ))}
        <View style={[styles.thumb, { left: `${clamped}%`, borderColor: color }]} />
      </View>

      <View style={styles.scaleRow}>
        <Text style={[styles.scaleLabel, { fontSize: type(10) }]}>WEAKER</Text>
        <Text style={[styles.scaleLabel, { fontSize: type(10) }]}>AVERAGE</Text>
        <Text style={[styles.scaleLabel, { fontSize: type(10) }]}>ELITE</Text>
      </View>

      <Text style={[styles.cohort, { fontSize: type(12), lineHeight: type(18) }]}>
        Graded for{' '}
        <Text style={styles.cohortStrong}>
          {gender} aged {ageRange}
        </Text>
        .
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: lumen.hairline,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  rpValue: {
    ...sora('extrabold'),
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.2,
  },
  trackWrap: {
    height: 18,
    marginBottom: 8,
    justifyContent: 'center',
  },
  trackBar: {
    height: 4,
    borderRadius: 999,
  },
  tick: {
    position: 'absolute',
    top: 4,
    width: 1,
    height: 10,
    marginLeft: -0.5,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 999,
    backgroundColor: lumen.fg,
    borderWidth: 2.5,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scaleLabel: {
    ...sora('bold'),
    color: lumen.fgFaint,
    letterSpacing: 0.4,
  },
  cohort: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
  cohortStrong: {
    ...sora('bold'),
    color: lumen.fg,
  },
});
