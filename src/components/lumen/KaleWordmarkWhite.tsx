// Design: assets/kale-logo.svg

import KaleLogo from '../../../assets/kale-logo.svg';

const LOGO_ASPECT = 91 / 38;

type Props = {
  height?: number;
  /** Wordmark fill. Defaults to white; the onboarding screens pass lime. */
  color?: string;
};

export function KaleWordmarkWhite({ height = 20, color = 'white' }: Props) {
  const width = height * LOGO_ASPECT;

  // kale-logo.svg paths use fill="currentColor"; react-native-svg maps the
  // `color` prop to currentColor, so this tints the wordmark.
  return <KaleLogo width={width} height={height} color={color} accessibilityLabel="Kale" />;
}
