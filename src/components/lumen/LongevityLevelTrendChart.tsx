import { Fragment } from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Line, Path, Stop, Text as SvgText } from 'react-native-svg';
import { lumen } from '../../theme';

type LongevityLevelTrendChartProps = {
  levels: number[];
  labels: string[];
  maxLevel?: number;
  width?: number;
  projectedFromIndex?: number;
};

export function LongevityLevelTrendChart({
  levels,
  labels,
  maxLevel = 10,
  width = 304,
  projectedFromIndex = -1,
}: LongevityLevelTrendChartProps) {
  const H = 130;
  const padL = 10;
  const padR = 10;
  const padT = 16;
  const padB = 24;
  const n = levels.length;
  const x = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * (width - padL - padR));
  const y = (v: number) => padT + (1 - v / maxLevel) * (H - padT - padB);
  const pts = levels.map((v, i) => [x(i), y(v)] as const);

  const splitIndex =
    projectedFromIndex >= 0 && projectedFromIndex < n - 1 ? projectedFromIndex : n - 1;
  const solidPts = pts.slice(0, splitIndex + 1);
  const projectedPts = pts.slice(splitIndex);

  const solidLine = solidPts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const projectedLine = projectedPts
    .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(' ');
  const area = `${solidLine} L ${x(splitIndex).toFixed(1)} ${H - padB} L ${x(0).toFixed(1)} ${H - padB} Z`;
  const projectedArea =
    projectedPts.length >= 2
      ? `${projectedLine} L ${x(n - 1).toFixed(1)} ${H - padB} L ${x(splitIndex).toFixed(1)} ${H - padB} Z`
      : '';

  return (
    <Svg width={width} height={H} viewBox={`0 0 ${width} ${H}`}>
      <Defs>
        <LinearGradient id="lumLvlGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={lumen.lime} stopOpacity="0.28" />
          <Stop offset="1" stopColor={lumen.lime} stopOpacity="0" />
        </LinearGradient>
        <LinearGradient id="lumLvlProjGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={lumen.lime} stopOpacity="0.16" />
          <Stop offset="1" stopColor={lumen.lime} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {[0, 0.5, 1].map((g) => (
        <Line
          key={g}
          x1={padL}
          x2={width - padR}
          y1={padT + g * (H - padT - padB)}
          y2={padT + g * (H - padT - padB)}
          stroke="rgba(234,243,228,0.08)"
          strokeWidth={1}
        />
      ))}
      <Path d={area} fill="url(#lumLvlGrad)" />
      {projectedArea ? <Path d={projectedArea} fill="url(#lumLvlProjGrad)" /> : null}
      <Path d={solidLine} fill="none" stroke={lumen.lime} strokeWidth={2.5} strokeLinecap="round" />
      {projectedPts.length >= 2 ? (
        <Path
          d={projectedLine}
          fill="none"
          stroke={lumen.lime}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray="6 5"
          opacity={0.8}
        />
      ) : null}
      {pts.map((p, i) => {
        const isOnboarding = i === 0;
        const isNow = projectedFromIndex >= 0 ? i === projectedFromIndex : i === n - 1;
        const isProjected = projectedFromIndex >= 0 && i > projectedFromIndex;
        const hollow = isOnboarding || isProjected;

        return (
          <Fragment key={`${labels[i]}-${i}`}>
            {isNow ? <Circle cx={p[0]} cy={p[1]} r={9} fill="rgba(0,200,150,0.18)" /> : null}
            <Circle
              cx={p[0]}
              cy={p[1]}
              r={isNow ? 5.5 : isProjected ? 5 : 4}
              fill={hollow ? lumen.bgDark : lumen.lime}
              stroke={lumen.lime}
              strokeWidth={hollow ? 2 : isNow ? 0 : 2}
              strokeDasharray={isProjected ? '3 3' : undefined}
              opacity={isProjected ? 0.85 : 1}
            />
            {isNow ? (
              <SvgText x={p[0]} y={p[1] - 12} fill={lumen.lime} fontSize={15} fontWeight="700" textAnchor="middle">
                {levels[i]}
              </SvgText>
            ) : null}
            <SvgText
              x={p[0]}
              y={H - 6}
              fill={isProjected ? lumen.fgFaint : lumen.fgMuted}
              fontSize={10}
              fontWeight="600"
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
