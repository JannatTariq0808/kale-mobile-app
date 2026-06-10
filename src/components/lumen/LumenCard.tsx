import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen } from '../../theme';

type LumenCardProps = {
  children: ReactNode;
  padding?: number;
  accent?: string;
  style?: ViewStyle;
};

/** KACard — kale-mobile-design/screens/KaleApp.jsx */
export function LumenCard({ children, padding, accent, style }: LumenCardProps) {
  const { cardPadding } = useResponsiveLayout();
  const pad = padding ?? cardPadding;

  return (
    <View style={[styles.card, accent ? { paddingLeft: pad + 4 } : null, { padding: pad }, style]}>
      {accent ? <View style={[styles.accentBar, { backgroundColor: accent }]} /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    backgroundColor: 'rgba(234,243,228,0.05)',
    borderWidth: 1,
    borderColor: lumen.hairline,
    borderRadius: 16,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});
