import Svg, { Circle, Line, Path } from 'react-native-svg';
import { lumen } from '../../theme';

type MetricSparklineProps = {
  data: number[];
  color?: string;
  baseline?: number;
  width?: number;
  height?: number;
};

function buildSparkPath(data: number[], width: number, height: number): string {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const xAt = (index: number) => (index / Math.max(1, data.length - 1)) * width;
  const yAt = (value: number) => 4 + (1 - (value - min) / range) * (height - 8);

  return data
    .map((value, index) => `${index ? 'L' : 'M'}${xAt(index).toFixed(1)} ${yAt(value).toFixed(1)}`)
    .join(' ');
}

function baselineY(data: number[], baseline: number, height: number): number {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  return 4 + (1 - (baseline - min) / range) * (height - 8);
}

export function MetricSparkline({
  data,
  color = lumen.lime,
  baseline,
  width = 96,
  height = 34,
}: MetricSparklineProps) {
  const path = buildSparkPath(data, width, height);
  const lastX = width;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const lastY = 4 + (1 - (data[data.length - 1] - min) / range) * (height - 8);

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {baseline != null ? (
        <Line
          x1={0}
          x2={width}
          y1={baselineY(data, baseline, height)}
          y2={baselineY(data, baseline, height)}
          stroke="rgba(234,243,228,0.18)"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
      ) : null}
      <Path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={lastX} cy={lastY} r={2.6} fill={color} />
    </Svg>
  );
}
