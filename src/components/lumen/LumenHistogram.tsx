import { StyleSheet, Text, View } from 'react-native';
import { lumen, sora } from '../../theme';

type LumenHistogramProps = {
  percentile?: number;
};

const BAR_COUNT = 24;
/** Center of the rightmost bar — marker sits here at 100th percentile. */
const LAST_BAR_CENTER = (BAR_COUNT - 0.5) / BAR_COUNT;

function barHeights() {
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    const x = (i + 0.5) / BAR_COUNT;
    return Math.exp(-((x - 0.5) ** 2) / (2 * 0.2 ** 2));
  });
}

const HEIGHTS = barHeights();

export function LumenHistogram({ percentile = 90 }: LumenHistogramProps) {
  const fillFrac = Math.max(0.05, Math.min(1, percentile / 100));
  const markerFrac =
    fillFrac >= 1 ? LAST_BAR_CENTER : Math.max(0.05, Math.min(LAST_BAR_CENTER, fillFrac));

  return (
    <View>
      <View style={styles.chart}>
        {HEIGHTS.map((h, i) => {
          const barFrac = (i + 0.5) / BAR_COUNT;
          const active = barFrac <= fillFrac;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                {
                  height: `${16 + h * 84}%`,
                  backgroundColor: active ? lumen.lime : lumen.track,
                  opacity: active ? 1 : 0.5,
                },
              ]}
            />
          );
        })}
        <View style={[styles.marker, { left: `${markerFrac * 100}%` }]} />
        <Text style={[styles.youLabel, { left: `${markerFrac * 100}%` }]}>YOU</Text>
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisLabel}>Lower</Text>
        <Text style={styles.axisLabel}>Everyone your age</Text>
        <Text style={styles.axisLabel}>Higher</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    position: 'relative',
    height: 88,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  bar: {
    flex: 1,
    borderRadius: 2,
  },
  marker: {
    position: 'absolute',
    top: -7,
    bottom: 0,
    width: 2,
    backgroundColor: lumen.fg,
    marginLeft: -1,
  },
  youLabel: {
    position: 'absolute',
    top: -22,
    ...sora('extrabold'),
    fontSize: 10,
    letterSpacing: 1.4,
    color: lumen.fg,
    transform: [{ translateX: -14 }],
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  axisLabel: {
    ...sora('semibold'),
    fontSize: 10.5,
    letterSpacing: 0.42,
    color: lumen.fgMuted,
  },
});
