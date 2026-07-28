import { memo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import type { RunningYearsTrajectory } from '../../types/runningYears';
import { keepVo2, maxVo2Ceiling, noneVo2 } from '../../utils/runningYearsProjection';
import { lumen } from '../../theme';

type RunYearsTrajectoryChartProps = {
  trajectory: RunningYearsTrajectory;
  goalAge: number;
  vo2Now?: number;
  declining?: boolean;
  width?: number;
  height?: number;
  /** Threshold label for the VO₂ floor (defaults to Still running). */
  stillActiveLabel?: string;
};

const DESIGN_WIDTH = 320;
const DESIGN_HEIGHT = 248;
const V_MIN = 12;
/** Expand plot space for floors (Independence → Still running); compress elite ceiling above. */
const FLOOR_BAND_TOP = 32;
const FLOOR_BAND_FRACTION = 0.62;
const V_MAX_BASE = 58;
const CROSS_LABEL_MIN_X = 52;

function linePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points
    .map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');
}

function gapPath(keepPts: Array<{ x: number; y: number }>, nonePts: Array<{ x: number; y: number }>): string {
  if (keepPts.length === 0 || nonePts.length === 0) return '';
  const forward = keepPts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  const backward = [...nonePts].reverse().map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ');
  return `M ${forward} L ${backward} Z`;
}

function crossDecadeLabel(age: number): string | null {
  const decade = Math.floor(age / 10) * 10;
  if (decade < 50) return null;
  return `~mid-${decade}s`;
}

/**
 * Piecewise Y scale: more vertical room for 12–32 (floors), compressed above for Max VO₂max.
 * t=0 at V_MIN (bottom), t=1 at vMax (top).
 */
function vo2ToUnit(vo2: number, vMax: number): number {
  const clamped = Math.max(V_MIN, Math.min(vMax, vo2));
  if (clamped <= FLOOR_BAND_TOP) {
    return ((clamped - V_MIN) / (FLOOR_BAND_TOP - V_MIN)) * FLOOR_BAND_FRACTION;
  }
  return (
    FLOOR_BAND_FRACTION +
    ((clamped - FLOOR_BAND_TOP) / Math.max(1, vMax - FLOOR_BAND_TOP)) * (1 - FLOOR_BAND_FRACTION)
  );
}

/** Left-side key — always start-aligned, matching design. */
function thresholdLabels(stillLabel: string): Array<{
  key: keyof RunningYearsTrajectory['thresholds'];
  label: string;
}> {
  return [
    { key: 'stillRunning', label: stillLabel },
    { key: 'active', label: 'Active life' },
    { key: 'independence', label: 'Independence' },
  ];
}

export const RunYearsTrajectoryChart = memo(function RunYearsTrajectoryChart({
  trajectory,
  goalAge,
  vo2Now,
  declining = false,
  width,
  height,
  stillActiveLabel = 'Still running',
}: RunYearsTrajectoryChartProps) {
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const labels = thresholdLabels(stillActiveLabel);

  const onLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    if (nextWidth > 0 && nextWidth !== measuredWidth) {
      setMeasuredWidth(nextWidth);
    }
  };

  const chartWidth = width ?? measuredWidth;
  const chartHeight = height ?? Math.round((chartWidth / DESIGN_WIDTH) * DESIGN_HEIGHT);

  if (chartWidth <= 0) {
    return <View style={styles.wrap} onLayout={onLayout} />;
  }

  const padL = 12;
  const padR = 10;
  const padT = 18;
  const padB = 26;
  const plotW = chartWidth - padL - padR;
  const plotH = chartHeight - padT - padB;

  const ageMin = trajectory.nowAge;
  const ageMax = 86;
  const nowVo2 = vo2Now ?? trajectory.keep[0] ?? 40;
  const ceilingAtStart = maxVo2Ceiling(ageMin);
  const vMax = Math.max(V_MAX_BASE, Math.ceil(nowVo2 + 6), Math.ceil(ceilingAtStart + 4));

  const xAt = (age: number) => padL + ((age - ageMin) / Math.max(1, ageMax - ageMin)) * plotW;

  const yAt = (vo2: number) => padT + (1 - vo2ToUnit(vo2, vMax)) * plotH;

  const sampleAges: number[] = [];
  for (let age = ageMin; age <= ageMax; age += 1.5) {
    sampleAges.push(age);
  }

  const maxPts = sampleAges.map((age) => ({
    x: xAt(age),
    y: yAt(maxVo2Ceiling(age)),
  }));

  const keepPts = sampleAges.map((age) => {
    const t = age - ageMin;
    const vo2 = keepVo2(nowVo2, t, declining, ageMin);
    return { x: xAt(age), y: yAt(vo2), age, vo2 };
  });

  const nonePts = sampleAges.map((age) => {
    const t = age - ageMin;
    const vo2 = noneVo2(nowVo2, t, ageMin);
    return { x: xAt(age), y: yAt(vo2) };
  });

  const nowPt = { x: xAt(ageMin), y: yAt(nowVo2) };

  const clampedGoalAge = Math.min(ageMax, Math.max(ageMin, goalAge));
  const goalVo2 = keepVo2(nowVo2, clampedGoalAge - ageMin, declining, ageMin);
  const goalPt = {
    x: xAt(clampedGoalAge),
    y: yAt(goalVo2),
  };

  let crossAge: number | null = null;
  for (let age = ageMin; age <= ageMax; age += 0.5) {
    const vo2 = keepVo2(nowVo2, age - ageMin, declining, ageMin);
    if (vo2 <= trajectory.thresholds.stillRunning) {
      crossAge = age;
      break;
    }
  }
  const crossX = crossAge != null ? xAt(crossAge) : null;
  const crossLabel = crossAge != null ? crossDecadeLabel(crossAge) : null;
  const showCrossMarker = crossX != null && crossLabel != null && crossX >= CROSS_LABEL_MIN_X;

  const ageTicks = [ageMin, 55, 65, 75, 85].filter(
    (age, index, arr) => arr.indexOf(age) === index && age >= ageMin,
  );

  const hereLabelX = nowPt.x + 14;
  const hereLabelY = nowPt.y < padT + 24 ? nowPt.y + 16 : nowPt.y - 5;
  const maxLabelY = yAt(maxVo2Ceiling(ageMin));

  return (
    <View style={styles.wrap} onLayout={width ? undefined : onLayout}>
      <Svg
        width={chartWidth}
        height={chartHeight}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <LinearGradient id="ryGap" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={lumen.lime} stopOpacity="0.26" />
            <Stop offset="1" stopColor={lumen.lime} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>

        {/* Elite ceiling — age-dependent Max VO₂max (above Still running). */}
        <Path
          d={linePath(maxPts)}
          fill="none"
          stroke="rgba(234,243,228,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
        <SvgText
          x={padL + 2}
          y={maxLabelY - 4}
          fill={lumen.fgMuted}
          fontSize={9.5}
          fontWeight="600"
          textAnchor="start"
        >
          Max VO₂max
        </SvgText>

        {labels.map(({ key, label }) => {
          const y = yAt(trajectory.thresholds[key]);
          const lineOpacity = key === 'independence' ? 0.08 : 0.14;
          return (
            <G key={key}>
              <Line
                x1={padL}
                x2={chartWidth - padR}
                y1={y}
                y2={y}
                stroke={`rgba(234,243,228,${lineOpacity})`}
                strokeWidth={1}
                strokeDasharray="2 4"
              />
              <SvgText
                x={padL + 2}
                y={y - 4}
                fill={lumen.fgMuted}
                fontSize={9.5}
                fontWeight="600"
                textAnchor="start"
              >
                {label}
              </SvgText>
            </G>
          );
        })}

        <Path d={gapPath(keepPts, nonePts)} fill="url(#ryGap)" />

        <Path
          d={linePath(nonePts)}
          fill="none"
          stroke={lumen.track}
          strokeWidth={2}
          strokeDasharray="3 4"
          opacity={0.8}
        />

        <Path
          d={linePath(keepPts)}
          fill="none"
          stroke={lumen.lime}
          strokeWidth={declining ? 2.5 : 3}
          strokeLinecap="round"
        />

        {showCrossMarker ? (
          <G>
            <Line
              x1={crossX!}
              x2={crossX!}
              y1={yAt(Math.min(vMax, maxVo2Ceiling(crossAge ?? ageMin)))}
              y2={yAt(trajectory.thresholds.stillRunning)}
              stroke="rgba(234,243,228,0.18)"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <SvgText
              x={crossX!}
              y={padT - 2}
              fill={lumen.lime}
              fontSize={10}
              fontWeight="800"
              textAnchor="middle"
            >
              {crossLabel}
            </SvgText>
          </G>
        ) : null}

        <G>
          <Line
            x1={goalPt.x}
            x2={goalPt.x}
            y1={goalPt.y}
            y2={yAt(trajectory.thresholds.stillRunning)}
            stroke="rgba(204,250,125,0.45)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </G>

        <Circle cx={nowPt.x} cy={nowPt.y} r={5.5} fill={lumen.lime} />
        <Circle
          cx={nowPt.x}
          cy={nowPt.y}
          r={10}
          fill="none"
          stroke={lumen.lime}
          strokeOpacity={0.4}
          strokeWidth={1.5}
        />
        <SvgText x={hereLabelX} y={hereLabelY} fill={lumen.fg} fontSize={10.5} fontWeight="700">
          You are here
        </SvgText>

        {ageTicks.map((age) => (
          <SvgText
            key={age}
            x={xAt(age)}
            y={chartHeight - 6}
            fill={lumen.fgMuted}
            fontSize={9.5}
            fontWeight="600"
            textAnchor="middle"
          >
            {age}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    overflow: 'visible',
  },
});
