import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen } from '../../theme';
import { RingCenterValue } from './RingCenterValue';

type LevelRingProps = {
  level: number;
  maxLevel?: number;
  size?: number;
};

export function LevelRing({ level, maxLevel = 10, size = 100 }: LevelRingProps) {
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const arc = (level / maxLevel) * circumference;
  const fontSize = Math.round(size * 0.42);

  return (
    <View style={[styles.root, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={cx} cy={cx} r={radius} stroke={lumen.track} strokeWidth={stroke} fill="none" />
        <G rotation={-90} origin={`${cx}, ${cx}`}>
          <Circle
            cx={cx}
            cy={cx}
            r={radius}
            stroke={lumen.lime}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
          />
        </G>
      </Svg>
      <View style={[styles.center, { width: size, height: size }]}>
        <RingCenterValue fontSize={fontSize} color={lumen.lime} letterSpacing={-0.8}>
          {level}
        </RingCenterValue>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    flexShrink: 0,
    overflow: 'visible',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
