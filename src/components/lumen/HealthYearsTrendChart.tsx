// Design: kale-mobile-design — KAHealthYearsChart (screens/KaleApp.jsx)

import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen, lumenPillar } from '../../theme';

type HealthYearsTrendChartProps = {
  lifespan: number[];
  healthspan: number[];
  labels: string[];
  width?: number;
  projectedFromIndex?: number;
};

function linePath(points: Array<{ x: number; y: number }>): string {
  return points.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
}

export function HealthYearsTrendChart({
  lifespan,
  healthspan,
  labels,
  width = 300,
  projectedFromIndex = -1,
}: HealthYearsTrendChartProps) {
  const H = 120;
  const maxV = Math.max(10, ...lifespan, ...healthspan, 1);
  const padL = 10;
  const padR = 10;
  const n = lifespan.length;
  const xAt = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * (width - padL - padR));
  const yAt = (v: number) => H - 12 - (v / maxV) * (H - 24);

  const lifespanPts = lifespan.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const healthspanPts = healthspan.map((v, i) => ({ x: xAt(i), y: yAt(v) }));
  const splitIndex =
    projectedFromIndex >= 0 && projectedFromIndex < n - 1 ? projectedFromIndex : n - 1;

  const solidLifespan = lifespanPts.slice(0, splitIndex + 1);
  const projectedLifespan = lifespanPts.slice(splitIndex);
  const solidHealthspan = healthspanPts.slice(0, splitIndex + 1);
  const projectedHealthspan = healthspanPts.slice(splitIndex);

  const projectionArea = (pts: Array<{ x: number; y: number }>) => {
    if (pts.length < 2) return '';
    return `${linePath(pts)} L ${pts[pts.length - 1].x} ${H - 12} L ${pts[0].x} ${H - 12} Z`;
  };

  return (
    <Svg width={width} height={H} viewBox={`0 0 ${width} ${H}`}>
      {[2, 4, 6, 8].map((g) => (
        <Line
          key={g}
          x1={padL}
          x2={width - padR}
          y1={yAt(g)}
          y2={yAt(g)}
          stroke="rgba(234,243,228,0.06)"
          strokeWidth={1}
        />
      ))}
      <Line x1={padL} x2={width - padR} y1={H - 12} y2={H - 12} stroke="rgba(234,243,228,0.08)" />

      {projectedHealthspan.length >= 2 ? (
        <Path d={projectionArea(projectedHealthspan)} fill={lumenPillar.knowledge} opacity={0.12} />
      ) : null}
      {projectedLifespan.length >= 2 ? (
        <Path d={projectionArea(projectedLifespan)} fill={lumenPillar.cardio} opacity={0.1} />
      ) : null}

      <Path
        d={linePath(solidHealthspan)}
        fill="none"
        stroke={lumenPillar.knowledge}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {projectedHealthspan.length >= 2 ? (
        <Path
          d={linePath(projectedHealthspan)}
          fill="none"
          stroke={lumenPillar.knowledge}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="5 5"
          opacity={0.75}
        />
      ) : null}
      {healthspan.map((v, i) => {
        const projected = projectedFromIndex >= 0 && i > projectedFromIndex;
        const isNow = projectedFromIndex >= 0 ? i === projectedFromIndex : i === n - 1;
        return (
          <Circle
            key={`h-${labels[i] ?? i}`}
            cx={xAt(i)}
            cy={yAt(v)}
            r={isNow ? 4 : projected ? 3.5 : 2.5}
            fill={projected ? lumen.bgDark : lumenPillar.knowledge}
            stroke={lumenPillar.knowledge}
            strokeWidth={projected ? 1.5 : 0}
          />
        );
      })}

      <Path
        d={linePath(solidLifespan)}
        fill="none"
        stroke={lumenPillar.cardio}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {projectedLifespan.length >= 2 ? (
        <Path
          d={linePath(projectedLifespan)}
          fill="none"
          stroke={lumenPillar.cardio}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="5 5"
          opacity={0.75}
        />
      ) : null}
      {lifespan.map((v, i) => {
        const projected = projectedFromIndex >= 0 && i > projectedFromIndex;
        const isNow = projectedFromIndex >= 0 ? i === projectedFromIndex : i === n - 1;
        return (
          <Circle
            key={`l-${labels[i] ?? i}`}
            cx={xAt(i)}
            cy={yAt(v)}
            r={isNow ? 4 : projected ? 3.5 : 2.5}
            fill={projected ? lumen.bgDark : lumenPillar.cardio}
            stroke={lumenPillar.cardio}
            strokeWidth={projected ? 1.5 : 0}
          />
        );
      })}

      {labels.map((label, i) => (
        <SvgText
          key={`lbl-${label}-${i}`}
          x={xAt(i)}
          y={H - 1}
          fill={i > projectedFromIndex && projectedFromIndex >= 0 ? lumen.fgFaint : lumen.fgMuted}
          fontSize={9}
          fontWeight="600"
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
}
