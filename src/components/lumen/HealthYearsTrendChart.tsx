// Design: kale-mobile-design — KAHealthYearsChart (screens/KaleApp.jsx)

import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen, lumenPillar } from '../../theme';

type HealthYearsTrendChartProps = {
  lifespan: number[];
  healthspan: number[];
  labels: string[];
  width?: number;
};

export function HealthYearsTrendChart({
  lifespan,
  healthspan,
  labels,
  width = 300,
}: HealthYearsTrendChartProps) {
  const H = 120;
  const maxV = 10;
  const padL = 10;
  const padR = 10;
  const n = lifespan.length;
  const xAt = (i: number) => padL + (n === 1 ? 0 : (i / (n - 1)) * (width - padL - padR));
  const yAt = (v: number) => H - 12 - (v / maxV) * (H - 24);
  const linePath = (arr: number[]) =>
    arr.map((v, i) => `${i ? 'L' : 'M'} ${xAt(i)} ${yAt(v)}`).join(' ');
  const areaPath = (arr: number[]) =>
    `${linePath(arr)} L ${xAt(arr.length - 1)} ${H - 12} L ${xAt(0)} ${H - 12} Z`;

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

      <Path d={areaPath(healthspan)} fill={lumenPillar.knowledge} opacity={0.12} />
      <Path
        d={linePath(healthspan)}
        fill="none"
        stroke={lumenPillar.knowledge}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {healthspan.map((v, i) => (
        <Circle
          key={`h-${labels[i] ?? i}`}
          cx={xAt(i)}
          cy={yAt(v)}
          r={i === n - 1 ? 4 : 2.5}
          fill={lumenPillar.knowledge}
        />
      ))}

      <Path
        d={linePath(lifespan)}
        fill="none"
        stroke={lumenPillar.cardio}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {lifespan.map((v, i) => (
        <Circle
          key={`l-${labels[i] ?? i}`}
          cx={xAt(i)}
          cy={yAt(v)}
          r={i === n - 1 ? 4 : 2.5}
          fill={lumenPillar.cardio}
        />
      ))}

      {labels.map((label, i) => (
        <SvgText
          key={`lbl-${label}-${i}`}
          x={xAt(i)}
          y={H - 1}
          fill={lumen.fgMuted}
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
