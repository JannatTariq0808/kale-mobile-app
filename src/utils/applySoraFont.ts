import React from 'react';
import {
  StyleSheet,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import {
  SORA_FAMILIES,
  fontFamilyForWeight,
  fonts,
  type FontWeightKey,
} from '../theme/fonts';

let applied = false;

/** @expo/vector-icons alias → the font file's own family name. */
const ICON_FONT_FAMILIES: Record<string, string> = {
  ionicons: 'Ionicons',
};

function withSoraFont(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  const flat = StyleSheet.flatten(style);

  if (!flat) {
    return { fontFamily: fonts.regular };
  }

  const { fontWeight, fontFamily, ...rest } = flat;

  // Already Sora: keep the family, drop fontWeight (RN ignores a custom family when it is set).
  if (fontFamily && SORA_FAMILIES.has(fontFamily)) {
    return { ...rest, fontFamily };
  }

  // Another explicit family (icon fonts, monospace): leave it alone, apart from mapping
  // @expo/vector-icons' lowercase aliases to the real family name iOS resolves (see fonts.ts).
  if (fontFamily) {
    const iconFamily = ICON_FONT_FAMILIES[fontFamily];
    return iconFamily ? { ...flat, fontFamily: iconFamily } : flat;
  }

  const weight = String(fontWeight ?? '400') as FontWeightKey;
  return { fontFamily: fontFamilyForWeight(weight), ...rest };
}

type ReactNativeExports = Record<string, unknown>;

/**
 * Replaces an export on the `react-native` module object with a wrapper component.
 *
 * `react-native/index.js` exposes every component through a configurable getter, and
 * `import { Text } from 'react-native'` compiles to a live property read, so redefining the
 * getter makes every later render (app code and libraries alike) use the wrapper.
 */
function replaceExport(
  rn: ReactNativeExports,
  name: 'Text' | 'TextInput',
  replacement: React.ComponentType<never>,
): boolean {
  try {
    Object.defineProperty(rn, name, {
      configurable: true,
      enumerable: true,
      get: () => replacement,
    });
    return rn[name] === replacement;
  } catch {
    return false;
  }
}

/**
 * Ensures every Text/TextInput uses Sora — strips fontWeight that breaks custom fonts.
 *
 * React Native 0.87+ ships Text/TextInput as plain function components (no `.render` to
 * monkey-patch), so we swap the module exports for thin wrappers instead. React 19 passes
 * `ref` as a normal prop, so spreading props forwards refs unchanged.
 */
export function applySoraFontGlobally() {
  if (applied) return;
  applied = true;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rn = require('react-native') as ReactNativeExports;
  const OriginalText = rn.Text as React.ComponentType<TextProps>;
  const OriginalTextInput = rn.TextInput as React.ComponentType<TextInputProps>;

  function SoraText(props: TextProps) {
    return React.createElement(OriginalText, {
      ...props,
      maxFontSizeMultiplier: props.maxFontSizeMultiplier ?? 1,
      style: withSoraFont(props.style),
    });
  }
  SoraText.displayName = 'Text';

  function SoraTextInput(props: TextInputProps) {
    return React.createElement(OriginalTextInput, {
      ...props,
      style: withSoraFont(props.style),
    });
  }
  // Keep statics such as `TextInput.State` reachable through the wrapper.
  Object.assign(SoraTextInput, OriginalTextInput);
  SoraTextInput.displayName = 'TextInput';

  const textOk = replaceExport(rn, 'Text', SoraText as React.ComponentType<never>);
  const inputOk = replaceExport(rn, 'TextInput', SoraTextInput as React.ComponentType<never>);

  if (__DEV__ && (!textOk || !inputOk)) {
    console.warn('[fonts] could not install the global Sora Text/TextInput wrappers', {
      textOk,
      inputOk,
    });
  }
}
