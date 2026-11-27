// Entrance animation for the home trend charts — each graph fades + rises in
// as it scrolls into view (mirrors the design's "chartFadeUp"). Driven off the
// scroll position so the animation is visible when the user reaches each chart,
// not played off-screen on first load.

import type { ReactNode } from 'react';
import { Dimensions, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

type ChartFadeInProps = {
  children: ReactNode;
  /** Shared scroll offset of the screen's ScrollView. */
  scrollY: SharedValue<number>;
};

const VIEWPORT_H = Dimensions.get('window').height;
/** Reveal once the chart's top passes this far down the viewport. */
const REVEAL_RATIO = 0.82;

export function ChartFadeIn({ children, scrollY }: ChartFadeInProps) {
  const progress = useSharedValue(0);
  const topY = useSharedValue<number>(-1);

  const onLayout = (e: LayoutChangeEvent) => {
    topY.value = e.nativeEvent.layout.y;
  };

  useAnimatedReaction(
    () => topY.value >= 0 && scrollY.value + VIEWPORT_H * REVEAL_RATIO > topY.value,
    (inView) => {
      if (inView && progress.value === 0) {
        progress.value = withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) });
      }
    },
  );

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 18 }],
  }));

  return (
    <Animated.View onLayout={onLayout} style={style}>
      {children}
    </Animated.View>
  );
}
