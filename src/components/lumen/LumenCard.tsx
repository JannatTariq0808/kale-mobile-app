import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { lumen } from '../../theme';

type LumenCardProps = {
  children: ReactNode;
  padding?: number;
  style?: ViewStyle;
};

/** K3Card — kale-mobile-design/screens/KaleApp2.jsx */
export function LumenCard({ children, padding = 20, style }: LumenCardProps) {
  return <View style={[styles.card, { padding }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    borderRadius: 16,
  },
});
