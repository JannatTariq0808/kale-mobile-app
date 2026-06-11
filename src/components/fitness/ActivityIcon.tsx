// Design: kale-mobile-design — KAActivityIcon (screens/KaleApp.jsx)

import Svg, { Circle, Path } from 'react-native-svg';

type ActivityIconProps = {
  type: 'run' | 'ride';
  size?: number;
  color?: string;
};

export function ActivityIcon({ type, size = 16, color = 'currentColor' }: ActivityIconProps) {
  if (type === 'ride') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx={5.5} cy={17.5} r={3.5} stroke={color} strokeWidth={1.8} />
        <Circle cx={18.5} cy={17.5} r={3.5} stroke={color} strokeWidth={1.8} />
        <Path
          d="M5.5 17.5L9 8h5l4.5 9.5M9 8l3.5-3.5h3"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={14} cy={4.5} r={1.8} stroke={color} strokeWidth={1.8} />
      <Path
        d="M5 13l3-3 3 1 2 4-2 3M10 21l3-4 2-3 5 2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 7.5l-2.5 3-3-1.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
