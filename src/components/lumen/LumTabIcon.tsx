// Design: kale-mobile-design — LumTabBar icons (screens/KaleLumenApp.jsx, lum-20 Settings)

import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type LumTabIconName = 'home' | 'pulse' | 'gift' | 'gear';

type LumTabIconProps = {
  name: LumTabIconName;
  color: string;
  size?: number;
};

const STROKE_WIDTH = 1.8;

/** Stroke icons from LumTabBar — not raster images; copied from design SVG paths. */
export function LumTabIcon({ name, color, size = 22 }: LumTabIconProps) {
  if (name === 'home') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-4v-7h-8v7H4a1 1 0 0 1-1-1Z"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'pulse') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3 12h4l2-6 4 12 2-6h6"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'gift') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="3"
          y="8"
          width="18"
          height="13"
          rx="1.5"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 12h18M12 8v13M7 8a2.5 2.5 0 1 1 0-5c1.5 0 3 1.5 5 5-3 0-4 0-5 0Zm10 0a2.5 2.5 0 1 0 0-5c-1.5 0-3 1.5-5 5 3 0 4 0 5 0Z"
          stroke={color}
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={STROKE_WIDTH} />
      <Path
        d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.5-2.4.9a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.4a7 7 0 0 0-2 1.2l-2.4-.9-2 3.5 2 1.6A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.6 2 3.5 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.4c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.5-2-1.6c.1-.4.1-.8.1-1.2Z"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
