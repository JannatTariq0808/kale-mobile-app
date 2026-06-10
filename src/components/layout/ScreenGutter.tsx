import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

/** Header/toolbar row — same horizontal gutter as ScreenScroll. */
export function ScreenGutter({ children, style }: Props) {
  const { horizontalPadding, contentWidth } = useResponsiveLayout();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingTop: insets.top, paddingHorizontal: horizontalPadding }, style]}>
      <View style={[styles.inner, { width: contentWidth, maxWidth: contentWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inner: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
