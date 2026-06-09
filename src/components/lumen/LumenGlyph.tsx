// Design: kale-mobile-design — LumenGlyph (screens/KaleLumen.jsx)
// Folds from centre: top K → bottom K → dot. Replays each loader cycle.

import { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const VIEW_W = 618;
const VIEW_H = 886;

const ARMS_BOTTOM = 421;
const LEGS_TOP = 464;
const DOT_BBOX = { x: 186, y: 0, w: 183, h: 182 };

const DOT_PATH =
  'M264.64 0.608C314.937 -6.071 361.09 29.302 367.533 79.47C373.976 129.637 338.253 175.459 287.889 181.624C237.889 187.746 192.322 152.45 185.925 102.645C179.528 52.838 214.704 7.239 264.64 0.608Z';
const LEGS_PATH =
  'M0 463.977L133.083 463.843C161.008 463.845 195.432 462.96 222.776 464.781C325.987 471.649 421.063 514.563 494.631 587.483C574.113 666.576 618.545 774.077 618.025 886.024L480.775 886.008C479.31 807.339 451.11 736.066 393.799 681.013C347.486 636.136 287.253 608.271 222.971 601.983C194.132 599.173 161.375 600.11 132.161 600.246L132.186 786.827C132.181 819.302 132.73 853.801 132.02 886.102C89.107 885.736 42.28 887.074 0 885.646V463.977Z';
const ARMS_PATH =
  'M0 0.425L84.979 0.417C97.472 0.418 120.082 1.048 132.113 -0.137L132.197 198.082C132.195 226.172 131.616 256.762 132.363 284.608C162.676 284.477 199.85 286.366 229.325 282.68C375.167 264.445 478.426 143.942 480.846 0.371C526.008 0.376 572.88 1.005 617.903 0.214C618.401 112.573 573.45 220.392 493.209 299.309C422.59 369.212 329.463 411.996 230.271 420.107C201.34 422.63 161.856 421.575 131.984 421.569L3.077 421.504L0 421.464V0.425Z';

const FOLD_EASING = Easing.bezier(0.34, 1.4, 0.5, 1);
const DOT_EASING = Easing.bezier(0.34, 1.7, 0.5, 1);

type LumenGlyphProps = {
  color?: string;
  height?: number;
  animated?: boolean;
  /** Increment each loader cycle to replay fold */
  cycle?: number;
  /** False while ring drains — glyph hidden */
  visible?: boolean;
};

function GlyphPath({
  d,
  color,
  width,
  height,
}: {
  d: string;
  color: string;
  width: number;
  height: number;
}) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill={color}>
      <Path d={d} />
    </Svg>
  );
}

function FullGlyphSvg({ color, width, height }: { color: string; width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill={color}>
      <Path d={DOT_PATH} />
      <Path d={LEGS_PATH} />
      <Path d={ARMS_PATH} />
    </Svg>
  );
}

function useArmsFold(cycle: number, armsSliceH: number, width: number) {
  const scaleY = useSharedValue(0);

  useLayoutEffect(() => {
    scaleY.value = 0;
    scaleY.value = withDelay(120, withTiming(1, { duration: 620, easing: FOLD_EASING }));
  }, [cycle, scaleY]);

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: width / 2 },
      { translateY: armsSliceH },
      { scaleY: scaleY.value },
      { translateY: -armsSliceH },
      { translateX: -width / 2 },
    ],
  }));
}

function useLegsFold(cycle: number) {
  const scaleY = useSharedValue(0);

  useLayoutEffect(() => {
    scaleY.value = 0;
    scaleY.value = withDelay(420, withTiming(1, { duration: 620, easing: FOLD_EASING }));
  }, [cycle, scaleY]);

  return useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
  }));
}

function useDotPop(cycle: number) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useLayoutEffect(() => {
    scale.value = 0;
    opacity.value = 0;
    scale.value = withDelay(
      920,
      withSequence(
        withTiming(1.35, { duration: 300, easing: DOT_EASING }),
        withTiming(1, { duration: 200, easing: DOT_EASING }),
      ),
    );
    opacity.value = withDelay(920, withTiming(1, { duration: 300, easing: DOT_EASING }));
  }, [cycle, opacity, scale]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
}

function AnimatedLumenGlyph({
  color,
  width,
  height,
  cycle,
}: {
  color: string;
  width: number;
  height: number;
  cycle: number;
}) {
  const armsSliceH = height * (ARMS_BOTTOM / VIEW_H);
  const legsTop = height * (LEGS_TOP / VIEW_H);
  const legsSliceH = height * ((VIEW_H - LEGS_TOP) / VIEW_H);
  const dotLeft = width * (DOT_BBOX.x / VIEW_W);
  const dotTop = height * (DOT_BBOX.y / VIEW_H);
  const dotW = width * (DOT_BBOX.w / VIEW_W);
  const dotH = height * (DOT_BBOX.h / VIEW_H);

  const armsStyle = useArmsFold(cycle, armsSliceH, width);
  const legsStyle = useLegsFold(cycle);
  const dotStyle = useDotPop(cycle);

  return (
    <View style={{ width, height }}>
      <View style={[styles.slice, { height: armsSliceH }]}>
        <Animated.View style={[styles.fullCanvas, { width, height }, armsStyle]}>
          <GlyphPath d={ARMS_PATH} color={color} width={width} height={height} />
        </Animated.View>
      </View>

      <View style={[styles.slice, { top: legsTop, height: legsSliceH }]}>
        <Animated.View style={[styles.fullCanvas, { width, height, top: -legsTop }, legsStyle]}>
          <GlyphPath d={LEGS_PATH} color={color} width={width} height={height} />
        </Animated.View>
      </View>

      <Animated.View
        style={[styles.dotBox, { left: dotLeft, top: dotTop, width: dotW, height: dotH }, dotStyle]}
      >
        <Svg
          width={dotW}
          height={dotH}
          viewBox={`${DOT_BBOX.x} ${DOT_BBOX.y} ${DOT_BBOX.w} ${DOT_BBOX.h}`}
          fill={color}
        >
          <Path d={DOT_PATH} />
        </Svg>
      </Animated.View>
    </View>
  );
}

export function LumenGlyph({
  color = '#14C088',
  height = 38,
  animated = false,
  cycle = 0,
  visible = true,
}: LumenGlyphProps) {
  const width = (VIEW_W / VIEW_H) * height;

  if (!animated) {
    return <FullGlyphSvg color={color} width={width} height={height} />;
  }

  if (!visible) {
    return null;
  }

  return <AnimatedLumenGlyph color={color} width={width} height={height} cycle={cycle} />;
}

const styles = StyleSheet.create({
  slice: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  fullCanvas: {
    position: 'absolute',
    left: 0,
  },
  dotBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
