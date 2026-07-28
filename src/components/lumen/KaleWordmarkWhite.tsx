// Design: assets/kale-logo.svg

import KaleLogo from '../../../assets/kale-logo.svg';

const LOGO_ASPECT = 91 / 38;

type Props = {
  height?: number;
  /** Kept for API compatibility — kale-logo.svg is white. */
  color?: string;
};

export function KaleWordmarkWhite({ height = 20 }: Props) {
  const width = height * LOGO_ASPECT;

  return <KaleLogo width={width} height={height} accessibilityLabel="Kale" />;
}
