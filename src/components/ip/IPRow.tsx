// Design: Lumen for IP — IPRow (screens/LumenIP.jsx): label left, value right, hairline between rows

import { StyleSheet, Text, View } from 'react-native';
import { lumen, sora } from '../../theme';

type IPRowProps = {
  label: string;
  value: string;
  valueColor?: string;
  last?: boolean;
};

export function IPRow({ label, value, valueColor, last = false }: IPRowProps) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: lumen.hairline,
  },
  label: {
    ...sora('semibold'),
    flexShrink: 1,
    // Keeps short labels ("Insurer") on one line next to a long value.
    minWidth: '34%',
    fontSize: 13.5,
    lineHeight: 19,
    color: lumen.fgMuted,
  },
  value: {
    ...sora('bold'),
    flexShrink: 1,
    fontSize: 14.5,
    lineHeight: 20,
    color: lumen.fg,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
