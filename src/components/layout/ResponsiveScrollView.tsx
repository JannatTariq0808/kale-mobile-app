import type { ReactNode } from 'react';
import { ScrollView, type ScrollViewProps, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

type Props = ScrollViewProps & {
  children: ReactNode;
  /** Base horizontal gutter at 390pt width — scales down on small phones. */
  gutter?: number;
};

export function ResponsiveScrollView({ children, gutter = 22, contentContainerStyle, ...rest }: Props) {
  const { pad } = useResponsiveLayout();

  return (
    <ScrollView
      {...rest}
      contentContainerStyle={[styles.content, { paddingHorizontal: pad(gutter) }, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
