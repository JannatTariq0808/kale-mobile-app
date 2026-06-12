import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { lumen } from '../theme';

/** Root / onboarding — instant cuts over shared welcome backdrop (no fade jank). */
export const rootStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'none',
  contentStyle: { backgroundColor: 'transparent' },
};

/** Opaque stack cards — prevents previous screen bleeding through during push/pop. */
export const opaqueStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: lumen.bgDark },
  gestureEnabled: true,
  animation: 'none',
};

export const kalettesStackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: 'transparent' },
  gestureEnabled: true,
  animation: 'none',
};
