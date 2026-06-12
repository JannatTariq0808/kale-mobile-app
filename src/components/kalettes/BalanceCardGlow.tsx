import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import { lumen } from '../../theme';

/** Soft radial bloom — design: radial-gradient blur on balance card (lum-16) */
export function BalanceCardGlow() {
  return (
    <View style={styles.wrap} pointerEvents="none">
      <Svg width={280} height={280} viewBox="0 0 280 280">
        <Defs>
          <RadialGradient id="balanceGlowInner" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={lumen.lime} stopOpacity={0.22} />
            <Stop offset="0.35" stopColor={lumen.lime} stopOpacity={0.1} />
            <Stop offset="0.65" stopColor={lumen.lime} stopOpacity={0.03} />
            <Stop offset="1" stopColor={lumen.lime} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="balanceGlowOuter" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={lumen.lime} stopOpacity={0.08} />
            <Stop offset="0.5" stopColor={lumen.lime} stopOpacity={0.04} />
            <Stop offset="1" stopColor={lumen.lime} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={280} height={280} fill="url(#balanceGlowOuter)" />
        <Rect x={40} y={40} width={200} height={200} fill="url(#balanceGlowInner)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: -70,
    top: -70,
  },
});
