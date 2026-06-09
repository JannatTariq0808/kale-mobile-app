import { StyleSheet, Text, View } from 'react-native';
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
      <Text style={styles.value}>{value}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    paddingVertical: 14,
    minWidth: 0,
  },
  label: {
    ...sora('semibold'),
    fontSize: 11,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: lumen.fgMuted,
    marginBottom: 6,
  },
  value: {
    ...sora('extrabold'),
    fontSize: 24,
    color: lumen.fg,
    letterSpacing: -0.48,
  },
  unit: {
    ...sora('semibold'),
    fontSize: 11,
    color: lumen.fgMuted,
    marginTop: 2,
  },
});
