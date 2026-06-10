// Design: kale-mobile-design — KAHealthYearsChart multi-assessment (screens/KaleApp.jsx)

import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen, lumenPillar } from '../../theme';

type HealthYearsTrendChartProps = {
  lifespan?: number[];
  healthspan?: number[];
  labels?: string[];
};

export function HealthYearsTrendChart({
  lifespan = [2.6, 3.0, 3.4, 3.8, 4.2],
  healthspan = [4.8, 5.4, 5.8, 6.4, 6.8],
  labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Now'],
}: HealthYearsTrendChartProps) {
  const W = 300;
  const H = 120;
  const maxV = 10;
  const xAt = (i: number, total: number) => (i / (total - 1)) * (W - 20) + 10;
  const yAt = (v: number) => H - 12 - (v / maxV) * (H - 24);
  const linePath = (arr: number[]) =>
    arr.map((v, i) => `${i ? 'L' : 'M'} ${xAt(i, arr.length)} ${yAt(v)}`).join(' ');

  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      <Line x1={10} x2={W - 10} y1={H - 12} y2={H - 12} stroke="rgba(234,243,228,0.08)" />
      <Path d={linePath(lifespan)} fill="none" stroke={lumenPillar.cardio} strokeWidth={2.2} />
      <Path d={linePath(healthspan)} fill="none" stroke={lumenPillar.knowledge} strokeWidth={2.2} />
      {labels.map((label, i) => (
        <SvgText
          key={label}
          x={xAt(i, labels.length)}
          y={H - 2}
          fill={lumen.fgMuted}
          fontSize={9}
          fontWeight="600"
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}
      <Circle cx={xAt(lifespan.length - 1, lifespan.length)} cy={yAt(lifespan.at(-1)!)} r={3.5} fill={lumenPillar.cardio} />
      <Circle cx={xAt(healthspan.length - 1, healthspan.length)} cy={yAt(healthspan.at(-1)!)} r={3.5} fill={lumenPillar.knowledge} />
    </Svg>
  );
}
