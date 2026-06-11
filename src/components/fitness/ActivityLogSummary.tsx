// Design: lum-13 summary hero (screens/KaleLumenApp.jsx)

import { StyleSheet, Text, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen, sora } from '../../theme';

type ActivityLogSummaryProps = {
  countedLabel: string;
  runCount: number;
  distanceKm: number;
};

export function ActivityLogSummary({ countedLabel, runCount, distanceKm }: ActivityLogSummaryProps) {
  const { type } = useResponsiveLayout();

  return (
    <View style={styles.wrap}>
      <View style={styles.col}>
        <Text style={[styles.eyebrow, { fontSize: type(10) }]}>{countedLabel}</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statNum, { fontSize: type(40) }]}>{runCount}</Text>
          <Text style={[styles.statUnit, { fontSize: type(12) }]}>runs</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.col}>
        <Text style={[styles.eyebrow, { fontSize: type(10) }]}>Distance</Text>
        <View style={styles.statRow}>
          <Text style={[styles.statNum, { fontSize: type(40) }]}>{distanceKm}</Text>
          <Text style={[styles.statUnit, { fontSize: type(12) }]}>km</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  col: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: lumen.hairline,
    marginHorizontal: 16,
  },
  eyebrow: {
    ...sora('bold'),
    color: lumen.fgMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 6,
  },
  statNum: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -1.2,
    lineHeight: 40,
    fontVariant: ['tabular-nums'],
  },
  statUnit: {
    ...sora('semibold'),
    color: lumen.fgMuted,
  },
});
