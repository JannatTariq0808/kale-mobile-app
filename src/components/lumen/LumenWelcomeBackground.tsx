// Design: kale-mobile-design — LumenBackdrop (screens/KaleLumen.jsx)

import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnUI,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { lumen } from '../../theme';
import {
  LUMEN_CURVE_CYCLE_MS,
  glassCurvePathAt,
  upperPathAt,
} from './lumenBackdropPaths';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const W = 390;
const H = 844;

/** Curved glass-edge backdrop — slow breathing curve (13s loop) */
export function LumenWelcomeBackground() {
  const progress = useSharedValue(0);

  useEffect(() => {
    runOnUI(() => {
      'worklet';
      progress.value = withRepeat(
        withTiming(1, { duration: LUMEN_CURVE_CYCLE_MS, easing: Easing.linear }),
        -1,
        false,
      );
    })();
  }, [progress]);

  const upperProps = useAnimatedProps(() => ({
    d: upperPathAt(progress.value),
  }));

  const curveProps = useAnimatedProps(() => ({
    d: glassCurvePathAt(progress.value),
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="lumUpperGrad" x1="0" y1="0" x2="0.7" y2="1">
            <Stop offset="0" stopColor={lumen.bgSurface} />
            <Stop offset="1" stopColor={lumen.bgLight} />
          </LinearGradient>
          <RadialGradient id="lumGloss" cx="0.18" cy="0.1" rx="0.85" ry="0.85">
            <Stop offset="0" stopColor="#EAF3E4" stopOpacity="0.055" />
            <Stop offset="0.55" stopColor="#EAF3E4" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="lumVignette" cx="0.12" cy="0.96" rx="0.7" ry="0.7">
            <Stop offset="0" stopColor="#002F30" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#002F30" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill={lumen.bgDeep} />
        <AnimatedPath animatedProps={upperProps} fill="url(#lumUpperGrad)" />
        <Rect x={0} y={0} width={W} height={H} fill="url(#lumVignette)" />
        <Rect x={0} y={0} width={W} height={H} fill="url(#lumGloss)" />
        <AnimatedPath
          animatedProps={curveProps}
          fill="none"
          stroke="#EAF3E4"
          strokeOpacity={0.13}
          strokeWidth={1.4}
        />
      </Svg>
    </View>
  );
}
