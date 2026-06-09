// Design: kale-mobile-design — lum-01 hero ring + glyph (screens/KaleLumen.jsx)

import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GLYPH_FLASH_MS } from './welcomeLoaderTiming';
import { LumenGlyph } from './LumenGlyph';
import { WelcomeHeroRing } from './WelcomeHeroRing';

type WelcomeHeroLoaderProps = {
  size?: number;
  glyphColor: string;
};

export function WelcomeHeroLoader({ size = 152, glyphColor }: WelcomeHeroLoaderProps) {
  const [glyphCycle, setGlyphCycle] = useState(0);
  const [glyphVisible, setGlyphVisible] = useState(true);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRingReset = useCallback(() => {
    if (flashTimer.current) clearTimeout(flashTimer.current);

    setGlyphVisible(false);

    flashTimer.current = setTimeout(() => {
      setGlyphCycle((c) => c + 1);
      setGlyphVisible(true);
    }, GLYPH_FLASH_MS);
  }, []);

  useEffect(
    () => () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    },
    [],
  );

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <WelcomeHeroRing size={size} onRingReset={handleRingReset} />
      <View style={styles.glyphWrap}>
        <LumenGlyph
          color={glyphColor}
          height={size * 0.44}
          animated
          cycle={glyphCycle}
          visible={glyphVisible}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  glyphWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
