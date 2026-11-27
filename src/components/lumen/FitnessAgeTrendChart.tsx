// Fitness Age vs actual age over the years ahead — a younger body means a lower price.
// Geometry ported from the Claude design export "19 · Home": a straight actual-age
// line, a lime fitness line that dips to a glowing "today" dot then projects as a
// dashed line to an end dot, with the gap between them shaded (the "younger" area).

import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { lumen } from '../../theme';

type FitnessAgeTrendChartProps = {
  /** Actual ages along the x-axis (e.g. [45, 46, …, 50]). */
  ages: number[];
  /** Fitness Age at each of those ages (lime line). */
  fitnessAges: number[];
  width?: number;
};

/** Hollow-dot fill — matches the card background so the ring reads as a hole. */
const DOT_HOLLOW_FILL = '#004C4C';

export function FitnessAgeTrendChart({
  ages,
  fitnessAges,
  width = 300,
}: FitnessAgeTrendChartProps) {
  const H = 150;
  const padL = 24;
  const padR = 10;
  const padTop = 14;
  const axisBottom = 104;
  const xAgesY = 126;
  const yourAgeY = 142;

  const n = ages.length;
  if (n === 0 || fitnessAges.length === 0) {
    return <Svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} />;
  }

  // Today vs the final projected year — the four values the chart is built from.
  const actualNow = ages[0];
  const actualEnd = ages[n - 1];
  const fitnessNow = fitnessAges[0];
  const fitnessEnd = fitnessAges[fitnessAges.length - 1];
  // The fitness line starts on the actual-age line (shared junction, so the
  // start dot sits on the coral line), then dips down to "today".
  const anchorV = actualNow;

  const allValues = [...ages, ...fitnessAges];
  const minV = Math.min(...allValues) - 2;
  const maxV = Math.max(...allValues) + 2;
  const span = Math.max(1, maxV - minV);

  const xStart = padL;
  const xEnd = width - padR;
  const plotW = Math.max(1, xEnd - xStart);
  const xToday = xStart + 0.05 * plotW;

  const yAt = (v: number) => padTop + (1 - (v - minV) / span) * (axisBottom - padTop);
  const xAtAge = (i: number) => xStart + (n <= 1 ? 0 : (i / (n - 1)) * plotW);
  // Actual-age line value at an arbitrary x (for the top edge of the gap shade).
  const yActualAt = (x: number) =>
    yAt(actualNow + ((x - xStart) / plotW) * (actualEnd - actualNow));

  const yAnchor = yAt(anchorV);
  const yActualNow = yAt(actualNow);
  const yActualEnd = yAt(actualEnd);
  const yFitnessNow = yAt(fitnessNow);
  const yFitnessEnd = yAt(fitnessEnd);

  // Gap shade: between the actual-age line (top) and the dashed fitness line (bottom).
  const gapArea = [
    `M ${xToday} ${yActualAt(xToday)}`,
    `L ${xEnd} ${yActualEnd}`,
    `L ${xEnd} ${yFitnessEnd}`,
    `L ${xToday} ${yFitnessNow}`,
    'Z',
  ].join(' ');

  return (
    <Svg width={width} height={H} viewBox={`0 0 ${width} ${H}`}>
      {/* Gridlines + y-axis value labels */}
      {[0, 1, 2, 3].map((i) => {
        const v = minV + (i / 3) * span;
        const y = yAt(v);
        return (
          <Line
            key={`grid-${i}`}
            x1={xStart}
            x2={xEnd}
            y1={y}
            y2={y}
            stroke="rgba(234,243,228,0.08)"
            strokeWidth={1}
          />
        );
      })}
      {[0, 1, 2, 3].map((i) => {
        const v = minV + (i / 3) * span;
        return (
          <SvgText
            key={`ylab-${i}`}
            x={padL - 6}
            y={yAt(v) + 3}
            fill="rgba(234,243,228,0.32)"
            fontSize={9}
            fontWeight="600"
            textAnchor="end"
          >
            {Math.round(v)}
          </SvgText>
        );
      })}

      {/* Shaded "younger" gap between the two lines */}
      <Path d={gapArea} fill={lumen.lime} opacity={0.1} />

      {/* Actual age — straight coral line */}
      <Path
        d={`M ${xStart} ${yActualNow} L ${xEnd} ${yActualEnd}`}
        fill="none"
        stroke={lumen.coral}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <SvgText
        x={xEnd}
        y={yActualEnd - 9}
        fill={lumen.coral}
        fontSize={10}
        fontWeight="700"
        textAnchor="end"
      >
        Actual age
      </SvgText>

      {/* Fitness Age — solid dip into "today", then dashed projection */}
      <Path
        d={`M ${xStart} ${yAnchor} L ${xToday} ${yFitnessNow}`}
        fill="none"
        stroke={lumen.lime}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Path
        d={`M ${xToday} ${yFitnessNow} L ${xEnd} ${yFitnessEnd}`}
        fill="none"
        stroke={lumen.lime}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray="4 5"
        opacity={0.6}
      />

      {/* Start anchor dot */}
      <Circle cx={xStart} cy={yAnchor} r={3.5} fill={DOT_HOLLOW_FILL} stroke={lumen.lime} strokeWidth={2} />

      {/* "Today" glow dot + current Fitness Age */}
      <Circle cx={xToday} cy={yFitnessNow} r={9} fill={lumen.lime} opacity={0.16} />
      <Circle cx={xToday} cy={yFitnessNow} r={5.5} fill={lumen.lime} />
      <SvgText
        x={xToday + 12}
        y={yFitnessNow + 18}
        fill={lumen.lime}
        fontSize={15}
        fontWeight="700"
        textAnchor="start"
      >
        {fitnessNow}
      </SvgText>

      {/* Projected end dot + "{age} at age {year}" */}
      <Circle
        cx={xEnd}
        cy={yFitnessEnd}
        r={4.5}
        fill={DOT_HOLLOW_FILL}
        stroke={lumen.lime}
        strokeWidth={2}
        strokeDasharray="2 2"
      />
      <SvgText
        x={xEnd}
        y={yFitnessEnd + 18}
        fill={lumen.lime}
        fontSize={10}
        fontWeight="700"
        textAnchor="end"
      >
        {`${fitnessEnd} at age ${actualEnd}`}
      </SvgText>

      {/* x-axis: the member's actual age at each step */}
      {ages.map((age, i) => (
        <SvgText
          key={`age-${i}`}
          x={xAtAge(i)}
          y={xAgesY}
          fill="rgba(234,243,228,0.58)"
          fontSize={10}
          fontWeight="600"
          textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}
        >
          {age}
        </SvgText>
      ))}
      <SvgText
        x={xEnd}
        y={yourAgeY}
        fill="rgba(234,243,228,0.32)"
        fontSize={9}
        fontWeight="600"
        textAnchor="end"
      >
        Your age
      </SvgText>
    </Svg>
  );
}
