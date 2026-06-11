import { Fragment } from 'react';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen } from '../../theme';

type KnowledgeScoreChartProps = {
  scores: number[];
  labels: string[];
  color: string;
  maxScore?: number;
  width?: number;
  pointSpacing?: number;
};

function scoreToLevel(score: number, maxScore: number): number {
  return Math.max(1, Math.min(10, Math.round((score / maxScore) * 10)));
}

/** Design: K3KnowledgeChart — lum-19 KaleFitnessKnowledgeLumen */
export function KnowledgeScoreChart({
  scores,
  labels,
  color,
  maxScore = 20,
  width,
  pointSpacing,
}: KnowledgeScoreChartProps) {
  const levels = scores.map((score) => scoreToLevel(score, maxScore));
  const H = 140;
  const padT = 18;
  const padB = 28;
  const padL = 30;
  const padR = 24;
  const n = levels.length;
  const chartWidth =
    width ?? (pointSpacing != null ? padL + padR + Math.max(0, n - 1) * pointSpacing : 300);
  const xAt = (i: number) => {
    if (n === 1) return chartWidth / 2;
    if (pointSpacing != null) return padL + i * pointSpacing;
    return padL + (i / (n - 1)) * (chartWidth - padL - padR);
  };
  const yAt = (v: number) => H - padB - ((v - 1) / 9) * (H - padT - padB);
  const linePath = levels
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(v).toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${xAt(n - 1).toFixed(1)} ${H - padB} L ${xAt(0).toFixed(1)} ${H - padB} Z`;

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
      <Path d={areaPath} fill={color} opacity={0.1} />
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
        const raw = scores[i];
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
              y={H - 8}
              fill={isLast ? lumen.fg : lumen.fgMuted}
              fontSize={8}
              fontWeight="700"
              textAnchor="middle"
            >
              {labels[i]} · {raw}/{maxScore}
            </SvgText>
          </Fragment>
        );
      })}
    </Svg>
  );
}

export function getKnowledgeChartWidth(
  pointCount: number,
  pointSpacing: number,
  padL = 30,
  padR = 24,
): number {
  if (pointCount <= 1) return padL + padR + 120;
  return padL + padR + (pointCount - 1) * pointSpacing;
}
