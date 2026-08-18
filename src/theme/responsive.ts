import { PixelRatio } from 'react-native';

/** Design reference width — iPhone 14 / Kale artboards (390pt). */
export const DESIGN_WIDTH = 390;

/** Phone content stays full width; tablets cap here and center. */
export const CONTENT_MAX_WIDTH = 480;

/** Tab bar content height + breathing room (see TabNavigator). */
export const TAB_BAR_CLEARANCE = 72;

export type LayoutMetrics = {
  windowWidth: number;
  windowHeight: number;
  fontScale: number;
  pixelDensity: number;
  /** Width inside left/right safe areas */
  usableWidth: number;
  widthScale: number;
  frameWidth: number;
  horizontalPadding: number;
  /** Fixed inner column width — use on all screen content */
  contentWidth: number;
  tabBarClearance: number;
  isCompact: boolean;
  isNarrow: boolean;
  isTight: boolean;
  isLargeText: boolean;
  isTablet: boolean;
  scale: (size: number) => number;
  type: (size: number) => number;
  /** iOS-safe line height for Sora — never clips below font size */
  leading: (fontSize: number, ratio?: number) => number;
  cardPadding: number;
  pad: (size: number) => number;
};

export function getLayoutMetrics(
  usableWidth: number,
  windowHeight: number,
  fontScale = 1,
  fullWindowWidth = usableWidth,
): LayoutMetrics {
  const pixelDensity = PixelRatio.get();
  const widthScale = Math.min(Math.max(usableWidth / DESIGN_WIDTH, 0.68), 1.12);
  const fontDampen = Math.min(Math.max(fontScale, 1), 1.5);
  const uiScale = widthScale / fontDampen;

  const frameWidth = Math.min(fullWindowWidth, CONTENT_MAX_WIDTH);
  const horizontalPadding = Math.max(20, Math.round(usableWidth * 0.06));
  const contentWidth = Math.max(0, usableWidth - horizontalPadding * 2);
  const isCompact = usableWidth < 370;
  const isNarrow = usableWidth < 400;
  const isLargeText = fontScale > 1.05;
  const isTight = isCompact || isNarrow || isLargeText || contentWidth < 310;
  // Use the short edge so landscape phones are not treated as tablets
  // (which would letterbox the camera with green side gutters).
  const isTablet = Math.min(fullWindowWidth, windowHeight) >= 600;
  const scale = (size: number) => Math.round(size * widthScale);
  const type = (size: number) => Math.max(9, Math.round(size * uiScale));
  const leading = (fontSize: number, ratio = 1.35) =>
    Math.max(Math.round(fontSize * ratio), fontSize + 6);
  const cardPadding = Math.max(12, Math.round(18 * uiScale));
  const pad = (size: number) => Math.round(size * widthScale);

  return {
    windowWidth: fullWindowWidth,
    windowHeight,
    fontScale,
    pixelDensity,
    usableWidth,
    widthScale,
    frameWidth,
    horizontalPadding,
    contentWidth,
    tabBarClearance: TAB_BAR_CLEARANCE,
    isCompact,
    isNarrow,
    isTight,
    isLargeText,
    isTablet,
    scale,
    type,
    leading,
    cardPadding,
    pad,
  };
}
