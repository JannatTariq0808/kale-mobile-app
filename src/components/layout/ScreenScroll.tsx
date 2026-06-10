import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

type ScreenScrollProps = ScrollViewProps & {
  children: ReactNode;
};

/**
 * Vertical scroll with a fixed-width content column so children cannot
 * expand past the viewport (common overflow cause on max display size).
 */
export function ScreenScroll({ children, contentContainerStyle, style, ...rest }: ScreenScrollProps) {
  const { contentWidth, horizontalPadding, tabBarClearance } = useResponsiveLayout();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      {...rest}
      style={[styles.scroll, style]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: horizontalPadding,
          paddingBottom: tabBarClearance + Math.max(insets.bottom, 0),
        },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bounces
    >
      <View style={[styles.column, { width: contentWidth, maxWidth: contentWidth }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
  },
  column: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
});
