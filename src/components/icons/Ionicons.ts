import createIconSet from '@expo/vector-icons/createIconSet';
import * as Font from 'expo-font';

/**
 * Ionicons registered under the font file's own family name ("Ionicons") instead of
 * @expo/vector-icons' lowercase alias ("ionicons"). Expo Go 58 on iOS (React Native 0.88)
 * resolves runtime-loaded fonts by their real name only, so the stock export renders "?"
 * boxes there. Same glyphs, same props; import this everywhere instead of @expo/vector-icons.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const glyphMap = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json') as Record<
  string,
  number
>;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const font = require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf') as number;

/**
 * vector-icons forces fontWeight/fontStyle "normal" on every glyph. A weight makes iOS resolve
 * the font by family (UIFont fontNamesForFamilyName), which finds nothing for a font registered
 * at runtime, so the glyph falls back to the system font. Clearing both keeps the by-name lookup.
 */
export const Ionicons = createIconSet(glyphMap, 'Ionicons', font, {
  fontWeight: undefined,
  fontStyle: undefined,
});

// Register the font as soon as the module loads, before any icon renders. Letting each Icon
// instance load it lazily left the first render on a stale font entry in Expo Go.
void Font.loadAsync({ Ionicons: font }).catch((error: unknown) => {
  if (__DEV__) {
    console.warn('[icons] Ionicons registration failed', error);
  }
});
