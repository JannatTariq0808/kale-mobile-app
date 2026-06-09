// Design: kale-mobile-design — step dots (KaleLumen.jsx: 9px solid + box-shadow 0 0 12px)

import { useId } from 'react';
import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const CORE = 9;
const GLOW_SIZE = 34;

type StepGlowDotProps = {
  color: string;
  /** Default 9 — LumEyebrow uses 7 */
  size?: number;
  style?: ViewStyle;
};

/** Solid core + outer halo (no blurred centre) */
export function StepGlowDot({ color, size = CORE, style }: StepGlowDotProps) {
  const gradientId = useId().replace(/:/g, '');
  const glowSize = Math.round(size * (GLOW_SIZE / CORE));
  const glowR = glowSize / 2;
  const glowInset = (size - glowSize) / 2;
  const coreStop = ((size / 2) / glowR) * 100;

  return (
    <View style={[styles.wrap, { width: size, height: size, marginTop: size === CORE ? 5 : 0 }, style]}>
      {Platform.OS === 'android' && (
        <View style={[styles.glowLayer, { left: glowInset, top: glowInset, width: glowSize, height: glowSize }]}>
          <Svg width={glowSize} height={glowSize}>
            <Defs>
              <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={color} stopOpacity={0} />
                <Stop offset={`${coreStop}%`} stopColor={color} stopOpacity={0} />
                <Stop offset={`${coreStop + 6}%`} stopColor={color} stopOpacity={0.35} />
                <Stop offset={`${coreStop + 22}%`} stopColor={color} stopOpacity={0.1} />
                <Stop offset="100%" stopColor={color} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={glowR} cy={glowR} r={glowR} fill={`url(#${gradientId})`} />
          </Svg>
        </View>
      )}
      <View
        style={[
          styles.core,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            shadowColor: color,
          },
          Platform.OS === 'ios' && styles.iosGlow,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: 'visible',
  },
  glowLayer: {
    position: 'absolute',
  },
  core: {
    zIndex: 1,
  },
  iosGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
  },
});
