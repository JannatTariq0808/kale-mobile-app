import { PixelRatio, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getLayoutMetrics, type LayoutMetrics } from '../theme/responsive';

export function useResponsiveLayout(): LayoutMetrics {
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableWidth = Math.max(0, width - insets.left - insets.right);
  const effectiveFontScale = Math.max(fontScale, PixelRatio.getFontScale());
  return getLayoutMetrics(usableWidth, height, effectiveFontScale, width);
}
