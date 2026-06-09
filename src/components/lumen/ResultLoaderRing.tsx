// Design: kale-mobile-design — KaleResultLoaderLumen (screens/KaleLumenResults.jsx)

import { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen, lumenBrand } from '../../theme';
import { LumenGlyph } from './LumenGlyph';

/** Design: KaleLumen.jsx colour step + fill transition 0.18s */
const COLOR_STEP_MS = 260;
const SPIN_MS = 1000;
const BRAND_COUNT = lumenBrand.length;
const ARC_FRACTION = 0.16;

type ResultLoaderRingProps = {
  size?: number;
};

export function ResultLoaderRing({ size = 248 }: ResultLoaderRingProps) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const arcLength = circumference * ARC_FRACTION;
  const rotation = useSharedValue(0);
  const colorProgress = useSharedValue(0);
  const [glyphColor, setGlyphColor] = useState<string>(lumenBrand[0]);

  useLayoutEffect(() => {
    runOnUI(() => {
      'worklet';
      rotation.value = withRepeat(
        withTiming(360, { duration: SPIN_MS, easing: Easing.linear }),
        -1,
        false,
      );
      colorProgress.value = withRepeat(
        withTiming(BRAND_COUNT, {
          duration: BRAND_COUNT * COLOR_STEP_MS,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    })();
  }, [colorProgress, rotation]);

  useAnimatedReaction(
    () => {
      const pos = colorProgress.value % BRAND_COUNT;
      const index = Math.floor(pos);
      const next = (index + 1) % BRAND_COUNT;
      const blend = pos - index;
      return interpolateColor(blend, [0, 1], [lumenBrand[index], lumenBrand[next]]);
    },
    (color) => {
      runOnJS(setGlyphColor)(color);
    },
  );

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cx}
          r={radius}
          stroke={lumen.track}
          strokeWidth={stroke}
          fill="none"
        />
      </Svg>

      <Animated.View style={[StyleSheet.absoluteFill, spinStyle]} pointerEvents="none">
        <Svg width={size} height={size}>
          <G rotation={-90} origin={`${cx}, ${cx}`}>
            <Circle
              cx={cx}
              cy={cx}
              r={radius}
              stroke={lumen.lime}
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${arcLength} ${circumference}`}
            />
          </G>
        </Svg>
      </Animated.View>

      <View style={styles.glyphWrap} pointerEvents="none">
        <LumenGlyph color={glyphColor} height={size * 0.3} animated />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  glyphWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
