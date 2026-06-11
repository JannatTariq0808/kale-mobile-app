import { Fragment } from 'react';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen } from '../../theme';

type PillarLevelOverTimeChartProps = {
  levels: number[];
  labels: string[];
  color: string;
  width?: number;
  /** Fixed spacing between points — enables wider scrollable charts. */
  pointSpacing?: number;
};

/** Design: K3LevelOverTime — lum-18 KaleFitnessStrengthLumen */
export function PillarLevelOverTimeChart({
  levels,
  labels,
  color,
  width,
  pointSpacing,
}: PillarLevelOverTimeChartProps) {
  const H = 140;
  const padT = 18;
  const padB = 22;
  const padL = 30;
  const padR = 24;
  const n = levels.length;
  const chartWidth =
    width ??
    (pointSpacing != null ? padL + padR + Math.max(0, n - 1) * pointSpacing : 300);
  const xAt = (i: number) =>
    pointSpacing != null
      ? padL + i * pointSpacing
      : padL + (n === 1 ? 0 : (i / (n - 1)) * (chartWidth - padL - padR));
  const yAt = (v: number) => H - padB - ((v - 1) / 9) * (H - padT - padB);
  const linePath = levels
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
    .join(' ');

  return (
    <Svg width={chartWidth} height={H} viewBox={`0 0 ${chartWidth} ${H}`}>
      {[2, 4, 6, 8, 10].map((v) => (
        <G key={v}>
          <Line
            x1={padL}
            x2={chartWidth - padR}
            y1={yAt(v)}
            y2={yAt(v)}
            stroke="rgba(234,243,228,0.06)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
          <SvgText x={4} y={yAt(v) + 3} fill={lumen.fgMuted} fontSize={9} fontWeight="700">
            L{v}
          </SvgText>
        </G>
      ))}
      <Path
        d={linePath}
        stroke={color}
        strokeWidth={2.4}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {levels.map((v, i) => {
        const isLast = i === n - 1;
        return (
          <Fragment key={`${labels[i]}-${i}`}>
            <Circle cx={xAt(i)} cy={yAt(v)} r={isLast ? 5 : 3.5} fill={color} />
            <SvgText
              x={xAt(i)}
              y={yAt(v) - 10}
              fill={isLast ? lumen.fg : lumen.fgMuted}
              fontSize={10}
              fontWeight="800"
              textAnchor="middle"
            >
              L{v}
            </SvgText>
            <SvgText
              x={xAt(i)}
              y={H - 6}
              fill={isLast ? lumen.fg : lumen.fgMuted}
              fontSize={9}
              fontWeight="700"
              textAnchor="middle"
            >
              {labels[i]}
            </SvgText>
          </Fragment>
        );
      })}
    </Svg>
  );
}

export function getPillarLevelChartWidth(
  pointCount: number,
  pointSpacing: number,
  padL = 30,
  padR = 24,
): number {
  return padL + padR + Math.max(0, pointCount - 1) * pointSpacing;
}
