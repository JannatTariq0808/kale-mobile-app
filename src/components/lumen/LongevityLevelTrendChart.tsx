import { Fragment } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Line, Path, Stop, Text as SvgText } from 'react-native-svg';
import { lumen } from '../../theme';

type LongevityLevelTrendChartProps = {
  levels?: number[];
  labels?: string[];
  maxLevel?: number;
};

export function LongevityLevelTrendChart({
  levels = [3, 4, 5, 6],
  labels = ['Q1', 'Q2', 'Q3', 'Now'],
  maxLevel = 10,
}: LongevityLevelTrendChartProps) {
  const W = 304;
  const H = 130;
  const padL = 10;
  const padR = 10;
  const padT = 16;
  const padB = 24;
  const n = levels.length;
  const x = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * (W - padL - padR));
  const y = (v: number) => padT + (1 - v / maxLevel) * (H - padT - padB);
  const pts = levels.map((v, i) => [x(i), y(v)] as const);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L ${x(n - 1).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;

  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <Defs>
        <LinearGradient id="lumLvlGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={lumen.lime} stopOpacity="0.28" />
          <Stop offset="1" stopColor={lumen.lime} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {[0, 0.5, 1].map((g) => (
        <Line
          key={g}
          x1={padL}
          x2={W - padR}
          y1={padT + g * (H - padT - padB)}
          y2={padT + g * (H - padT - padB)}
          stroke="rgba(234,243,228,0.08)"
          strokeWidth={1}
        />
      ))}
      <Path d={area} fill="url(#lumLvlGrad)" />
      <Path d={line} fill="none" stroke={lumen.lime} strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => {
        const last = i === n - 1;
        return (
          <Fragment key={labels[i]}>
            <Circle
              cx={p[0]}
              cy={p[1]}
              r={last ? 5.5 : 3.5}
              fill={last ? lumen.lime : lumen.bgDark}
              stroke={lumen.lime}
              strokeWidth={last ? 0 : 2}
            />
            {last ? (
              <SvgText x={p[0]} y={p[1] - 12} fill={lumen.lime} fontSize={15} fontWeight="700" textAnchor="middle">
                {levels[i]}
              </SvgText>
            ) : null}
            <SvgText x={p[0]} y={H - 6} fill={lumen.fgMuted} fontSize={10} fontWeight="600" textAnchor="middle">
              {labels[i]}
            </SvgText>
          </Fragment>
        );
      })}
    </Svg>
  );
}
