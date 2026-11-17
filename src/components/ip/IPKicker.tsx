// Design: Lumen for IP — IPKicker (screens/LumenIP.jsx): glow dot + uppercase label

import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { StepGlowDot } from '../lumen/StepGlowDot';
import { lumen, sora } from '../../theme';

type IPKickerProps = {
  children: string;
  color?: string;
  dot?: boolean;
  style?: ViewStyle;
};

export function IPKicker({ children, color = lumen.lime, dot = true, style }: IPKickerProps) {
  return (
    <View style={[styles.row, style]}>
      {dot ? <StepGlowDot color={color} size={7} /> : null}
      <Text style={[styles.label, { color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...sora('bold'),
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.54,
    textTransform: 'uppercase',
  },
});
