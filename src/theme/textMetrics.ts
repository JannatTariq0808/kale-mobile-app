import { Platform, type TextStyle } from 'react-native';
import { sora } from './fonts';

/**
 * RN clips glyphs when lineHeight ≤ fontSize (especially Sora extrabold).
 * Design CSS ratios like 0.82em must become fontSize + padding in pixels.
 */
export function displayLineHeight(fontSize: number): number {
  const pad =
    fontSize >= 64
      ? Math.max(14, Math.round(fontSize * 0.16))
      : fontSize >= 40
        ? Math.max(10, Math.round(fontSize * 0.12))
        : Math.max(6, Math.round(fontSize * 0.1));
  return fontSize + pad;
}

/** Headlines (extrabold) — extra ascender room. */
export function headlineLineHeight(fontSize: number): number {
  return Math.max(Math.round(fontSize * 1.22), fontSize + 8);
}

/** Body / subhead under headlines. */
export function bodyLineHeight(fontSize: number): number {
  return Math.max(Math.round(fontSize * 1.5), fontSize + 6);
}

const fontPaddingFix =
  Platform.OS === 'android' ? ({ includeFontPadding: false } as const) : null;

/** Large stat numbers (+6.8, 486, 1:43 hero rows). */
export function displayTextStyle(
  fontSize: number,
  color: string,
  face: 'semibold' | 'extrabold' = 'semibold',
): TextStyle {
  const lineHeight = displayLineHeight(fontSize);
  return {
    ...sora(face),
    fontSize,
    lineHeight,
    color,
    fontVariant: ['tabular-nums'],
    ...fontPaddingFix,
  };
}

/** Extrabold headline block. */
export function headlineTextStyle(fontSize: number, color: string): TextStyle {
  return {
    ...sora('extrabold'),
    fontSize,
    lineHeight: headlineLineHeight(fontSize),
    color,
    ...fontPaddingFix,
  };
}

/** Semibold body copy. */
export function bodyTextStyle(fontSize: number, color: string): TextStyle {
  return {
    ...sora('semibold'),
    fontSize,
    lineHeight: bodyLineHeight(fontSize),
    color,
    ...fontPaddingFix,
  };
}

/** Single digit/value centered inside a progress ring. */
export function ringValueTextStyle(
  fontSize: number,
  color: string,
  letterSpacing = -0.5,
): TextStyle {
  const lineHeight = fontSize + Math.max(4, Math.round(fontSize * 0.1));
  const nudgeY = Platform.OS === 'ios' ? Math.round(fontSize * 0.045) : 0;

  return {
    ...sora('semibold'),
    fontSize,
    lineHeight,
    color,
    letterSpacing,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
    transform: nudgeY ? [{ translateY: nudgeY }] : undefined,
    ...fontPaddingFix,
  };
}
