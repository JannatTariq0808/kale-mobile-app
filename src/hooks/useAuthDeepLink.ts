import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { parsePasswordResetLink } from '../navigation/linking';

export function useAuthDeepLink(
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>,
) {
  const handled = useRef(new Set<string>());

  useEffect(() => {
    const openFromUrl = (url: string | null) => {
      if (!url || handled.current.has(url)) return;

      const reset = parsePasswordResetLink(url);
      if (!reset) return;

      handled.current.add(url);

      const navigate = () => {
        navigationRef.current?.navigate('NewPassword', { oobCode: reset.oobCode });
      };

      if (navigationRef.current?.isReady()) {
        navigate();
      } else {
        setTimeout(navigate, 0);
      }
    };

    void Linking.getInitialURL().then(openFromUrl);

    const subscription = Linking.addEventListener('url', ({ url }) => {
      openFromUrl(url);
    });

    return () => subscription.remove();
  }, [navigationRef]);
}
