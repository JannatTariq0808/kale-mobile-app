// Shared Q1 baseline timeline — used when assessmentCount === 1 (no trend to compare).

import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { lumen, sora } from '../../theme';

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const;
const W = 304;
const H = 72;
const PAD = 18;

type QuarterBaselineTimelineProps = {
  activeIndex?: number;
};

export function QuarterBaselineTimeline({ activeIndex = 0 }: QuarterBaselineTimelineProps) {
  const n = QUARTERS.length;
  const xAt = (i: number) => PAD + (i / (n - 1)) * (W - PAD * 2);
  const y = 28;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line
          x1={xAt(0)}
          y1={y}
          x2={xAt(n - 1)}
          y2={y}
          stroke="rgba(234,243,228,0.12)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />
        {QUARTERS.map((label, i) => {
          const x = xAt(i);
          const active = i === activeIndex;
          const future = i > activeIndex;

          return (
            <Circle
              key={label}
              cx={x}
              cy={y}
              r={active ? 6 : 4}
              fill={active ? lumen.lime : lumen.bgDark}
              stroke={active ? lumen.lime : lumen.hairline}
              strokeWidth={active ? 0 : 1.5}
              opacity={future ? 0.45 : 1}
            />
          );
        })}
        {QUARTERS.map((label, i) => (
          <SvgText
            key={`t-${label}`}
            x={xAt(i)}
            y={H - 8}
            fill={i === activeIndex ? lumen.lime : lumen.fgMuted}
            fontSize={10}
            fontWeight={i === activeIndex ? '700' : '600'}
            textAnchor="middle"
            opacity={i > activeIndex ? 0.45 : 1}
          >
            {label}
          </SvgText>
        ))}
      </Svg>
      <Text style={styles.caption}>
        Baseline from your first assessment — trends unlock after Q1.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  caption: {
    ...sora('semibold'),
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    color: lumen.fgMuted,
    textAlign: 'center',
  },
});
