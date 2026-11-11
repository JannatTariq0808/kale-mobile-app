/** Sora — kale-tokens.css --font-sans */
/**
 * Keys are the fonts' own PostScript names, and useSoraFonts registers each file under the
 * same key. Expo Go 58 (React Native 0.88) resolves runtime-loaded fonts on iOS by their real
 * name only, so alias names such as "Sora_700Bold" render in the system font there.
 */
export const fonts = {
  regular: 'Sora-Regular',
  semibold: 'Sora-SemiBold',
  bold: 'Sora-Bold',
  extrabold: 'Sora-ExtraBold',
} as const;

export type FontWeightKey = '400' | '600' | '700' | '800';

const weightMap: Record<FontWeightKey, string> = {
  '400': fonts.regular,
  '600': fonts.semibold,
  '700': fonts.bold,
  '800': fonts.extrabold,
};

export function fontFamilyForWeight(weight: FontWeightKey | string = '400') {
  return weightMap[weight as FontWeightKey] ?? fonts.regular;
}

/** Use instead of fontWeight — RN ignores custom fontFamily when fontWeight is also set */
export function sora(face: keyof typeof fonts) {
  return { fontFamily: fonts[face] };
}

/** NavigationContainer theme — FontStyle requires fontWeight alongside fontFamily */
export const navigationFonts = {
  regular: { fontFamily: fonts.regular, fontWeight: '400' as const },
  medium: { fontFamily: fonts.semibold, fontWeight: '600' as const },
  bold: { fontFamily: fonts.bold, fontWeight: '700' as const },
  heavy: { fontFamily: fonts.extrabold, fontWeight: '800' as const },
};

export const SORA_FAMILIES = new Set<string>(Object.values(fonts));
