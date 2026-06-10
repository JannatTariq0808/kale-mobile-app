// Design: kale-mobile-design — KaleResultLoaderLumen (screens/KaleLumenResults.jsx)

import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen } from '../../theme';
import { LumenGlyph } from './LumenGlyph';

const SPIN_MS = 1200;
const ARC_FRACTION = 0.16;

type ResultLoaderRingProps = {
  size?: number;
};

export const ResultLoaderRing = memo(function ResultLoaderRing({ size = 248 }: ResultLoaderRingProps) {
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const arcLength = circumference * ARC_FRACTION;
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: SPIN_MS, easing: Easing.linear }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(rotation);
    };
  }, [rotation]);

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
        <LumenGlyph color={lumen.lime} height={size * 0.3} animated={false} />
      </View>
    </View>
  );
});

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
