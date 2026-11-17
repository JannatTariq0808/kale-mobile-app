// Design: Lumen for IP — IPPrice (screens/LumenIP.jsx): small £, large tabular number, muted unit

import { StyleSheet, Text, View } from 'react-native';
import { displayTextStyle } from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';

type IPPriceProps = {
  /** Already formatted number, e.g. "1,800" or "25" */
  value: string;
  size?: number;
  unit?: string | null;
  color?: string;
};

export function IPPrice({ value, size = 64, unit = 'a month', color = lumen.lime }: IPPriceProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.sign, { fontSize: Math.round(size * 0.45), lineHeight: Math.round(size * 0.6), color }]}>
        £
      </Text>
      <Text style={[displayTextStyle(size, color, 'semibold'), styles.value]}>{value}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  sign: {
    ...sora('semibold'),
  },
  value: {
    letterSpacing: -2,
  },
  unit: {
    ...sora('semibold'),
    fontSize: 14,
    lineHeight: 18,
    color: lumen.fgMuted,
    marginLeft: 8,
  },
});
