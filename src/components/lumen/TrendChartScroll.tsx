import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

/** Quarters visible without horizontal scroll — scroll when count exceeds this. */
export const TREND_POINTS_INLINE_MAX = 4;

const SLOT_WIDTH = 72;
const CHART_PAD = 16;

export function chartWidthForPoints(pointCount: number, viewportWidth: number) {
  const slots = Math.max(pointCount - 1, 1);
  const contentWidth = CHART_PAD * 2 + slots * SLOT_WIDTH;
  return Math.max(viewportWidth, contentWidth);
}

type TrendChartScrollProps = {
  pointCount: number;
  height: number;
  children: (chartWidth: number) => ReactNode;
};

export function TrendChartScroll({ pointCount, height, children }: TrendChartScrollProps) {
  const { contentWidth, cardPadding } = useResponsiveLayout();
  const viewportWidth = Math.max(240, contentWidth - cardPadding * 2);
  const chartWidth = chartWidthForPoints(pointCount, viewportWidth);
  const scrollable = pointCount > TREND_POINTS_INLINE_MAX;

  if (!scrollable) {
    return (
      <View style={[styles.frame, { height, width: '100%' }]}>
        {children(viewportWidth)}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.frame, { height }]}
      contentContainerStyle={{ height, width: chartWidth }}
      nestedScrollEnabled
      bounces={false}
      decelerationRate="fast"
    >
      {children(chartWidth)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: '100%',
    overflow: 'hidden',
  },
});
