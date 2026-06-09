import * as NavigationBar from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { Platform } from 'react-native';
import { lumen } from '../theme';

/** Android system UI — edge-to-edge safe (Expo SDK 54). */
export async function hideAndroidSystemNav() {
  if (Platform.OS !== 'android') return;

  await SystemUI.setBackgroundColorAsync(lumen.bgDark);

  try {
    await NavigationBar.setVisibilityAsync('hidden');
  } catch {
    // Falls back to expo-navigation-bar plugin in app.json.
  }

  NavigationBar.setStyle('dark');
}
