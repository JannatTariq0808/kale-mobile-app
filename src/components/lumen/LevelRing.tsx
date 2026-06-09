import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { lumen, sora } from '../../theme';

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

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cx}
          r={radius}
          stroke={lumen.track}
          strokeWidth={stroke}
          fill="none"
        />
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
      <View style={styles.center}>
        <Text style={[styles.level, { fontSize: size * 0.42 }]}>{level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  level: {
    ...sora('semibold'),
    color: lumen.lime,
    letterSpacing: -0.8,
    lineHeight: undefined,
  },
});
