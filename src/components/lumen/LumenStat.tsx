import { StyleSheet, Text, View } from 'react-native';
import { displayTextStyle } from '../../theme/textMetrics';
import { lumen, sora } from '../../theme';

type LumenStatProps = {
  label: string;
  value: string;
  unit?: string;
};

export function LumenStat({ label, value, unit }: LumenStatProps) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueBlock}>
        <Text
          style={[styles.value, displayTextStyle(24, lumen.fg, 'extrabold')]}
          numberOfLines={2}
        >
          {value}
        </Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingVertical: 14,
    minWidth: 0,
    overflow: 'visible',
  },
  label: {
    ...sora('semibold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 6,
  },
  valueBlock: {
    gap: 2,
  },
  value: {
    letterSpacing: -0.48,
  },
  unit: {
    ...sora('semibold'),
    fontSize: 11,
    lineHeight: 15,
    color: lumen.fgMuted,
  },
});
