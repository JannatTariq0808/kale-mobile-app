import type { ComponentType } from 'react';
import { ResponsiveAppFrame } from '../components/layout/ResponsiveAppFrame';

/**
 * Centers a phone-width column on iPad. Identity on phones — no layout change.
 */
export function framed<P extends object>(Screen: ComponentType<P>): ComponentType<P> {
  function FramedScreen(props: P) {
    return (
      <ResponsiveAppFrame>
        <Screen {...props} />
      </ResponsiveAppFrame>
    );
  }
  FramedScreen.displayName = `Framed(${Screen.displayName ?? Screen.name})`;
  return FramedScreen;
}
