// Design: kale-mobile-design — LumAppBg (screens/KaleLumenApp.jsx)

import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { lumen } from '../../theme';

const W = 390;
const H = 844;
const PEAK = 150;
const B = PEAK + 70;

const UPPER = `M0,0 H${W} V${PEAK} C 250,${PEAK + 40} 150,${B} 0,${B} Z`;
const CURVE = `M0,${B} C 150,${B} 250,${PEAK + 40} ${W},${PEAK}`;

/** Teal base + curved green header zone (top-left only). */
export function LumenBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="lumAppUpper" x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor={lumen.bgAppUpperStart} />
            <Stop offset="1" stopColor={lumen.bgAppUpperEnd} />
          </LinearGradient>
          <RadialGradient id="lumAppGloss" cx="0.18" cy="0.06" r="0.8">
            <Stop offset="0" stopColor="#EAF3E4" stopOpacity="0.06" />
            <Stop offset="0.6" stopColor="#EAF3E4" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill={lumen.bgDeep} />
        <Path d={UPPER} fill="url(#lumAppUpper)" />
        <Rect x={0} y={0} width={W} height={H} fill="url(#lumAppGloss)" />
        <Path
          d={CURVE}
          fill="none"
          stroke="#EAF3E4"
          strokeOpacity={0.13}
          strokeWidth={1.4}
        />
      </Svg>
    </View>
  );
}
