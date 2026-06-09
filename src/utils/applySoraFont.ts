import React from 'react';
import { StyleSheet, Text, TextInput, type StyleProp, type TextStyle } from 'react-native';
import {
  SORA_FAMILIES,
  fontFamilyForWeight,
  fonts,
  type FontWeightKey,
} from '../theme/fonts';

let applied = false;

function withSoraFont(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  const flat = StyleSheet.flatten(style);

  if (!flat) {
    return { fontFamily: fonts.regular };
  }

  const { fontWeight, fontFamily, ...rest } = flat;

  if (fontFamily && SORA_FAMILIES.has(fontFamily)) {
    return rest;
  }

  const weight = String(fontWeight ?? '400') as FontWeightKey;
  return { fontFamily: fontFamilyForWeight(weight), ...rest };
}

/** Ensures every Text/TextInput uses Sora — strips fontWeight that breaks custom fonts */
export function applySoraFontGlobally() {
  if (applied) return;
  applied = true;

  const textRender = Text.render;
  Text.render = function render(...args) {
    const origin = textRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: withSoraFont(origin.props.style),
    });
  };

  const textInputRender = TextInput.render;
  TextInput.render = function render(...args) {
    const origin = textInputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: withSoraFont(origin.props.style),
    });
  };
}
