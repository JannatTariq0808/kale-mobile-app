import {
  Sora_400Regular,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/sora';
import { fonts } from '../theme/fonts';

export function useSoraFonts() {
  // Keys match each file's PostScript name (see theme/fonts.ts) so iOS resolves them
  // by real name and Android by alias, which are now the same string.
  const [loaded, error] = useFonts({
    [fonts.regular]: Sora_400Regular,
    [fonts.semibold]: Sora_600SemiBold,
    [fonts.bold]: Sora_700Bold,
    [fonts.extrabold]: Sora_800ExtraBold,
  });

  if (__DEV__ && error) {
    // Surfaces font asset failures in the Metro log instead of silently falling back.
    console.warn('[fonts] Sora failed to load; using the system font', error);
  }

  return loaded || !!error;
}
