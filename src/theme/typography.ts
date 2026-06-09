import { fonts } from './fonts';

/** Mobile type scale — fixed px; calibrate on device. Source: kale-tokens.css + Lumen screens */
export const typography = {
  fontFamily: fonts.regular,

  hero: 38,
  title: 32,
  headline: 18,
  body: 16,
  small: 14,
  caption: 12,
  micro: 10,

  weightRegular: '400' as const,
  weightSemibold: '600' as const,
  weightBold: '700' as const,
  weightExtrabold: '800' as const,
} as const;
