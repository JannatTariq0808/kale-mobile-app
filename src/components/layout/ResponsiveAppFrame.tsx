import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { lumen } from '../../theme';

type Props = {
  children: ReactNode;
};

/** Centers content on tablets; keeps full width on phones. */
export function ResponsiveAppFrame({ children }: Props) {
  const { isTablet } = useResponsiveLayout();

  return (
    <View style={styles.outer}>
      <View style={[styles.inner, isTablet && styles.tabletInner]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: lumen.bgDeep,
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  tabletInner: {
    maxWidth: 480,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: lumen.hairline,
  },
});
