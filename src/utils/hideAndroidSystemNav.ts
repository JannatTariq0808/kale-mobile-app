import { NavigationBar } from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { Platform } from 'react-native';
import { lumen } from '../theme';

/** Android system UI — edge-to-edge safe (Expo SDK 58: `setVisibilityAsync` is deprecated). */
export async function hideAndroidSystemNav() {
  if (Platform.OS !== 'android') return;

  await SystemUI.setBackgroundColorAsync(lumen.bgDark);

  try {
    NavigationBar.setHidden(true);
  } catch {
    // Falls back to the expo-navigation-bar plugin config (`hidden: true`) in app.config.js.
  }

  NavigationBar.setStyle('dark');
}
