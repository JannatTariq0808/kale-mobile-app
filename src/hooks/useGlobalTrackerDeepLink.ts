import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';
import type { NavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import {
  connectLinkToRouteParams,
  parseTrackerConnectLink,
} from '../navigation/trackerLinking';
import {
  isPendingTokenInFlight,
  isTrackerOAuthInProgress,
  recordConnectLinkUrl,
} from '../services/tracker/connectSession';

/** Routes tracker OAuth deep links to ConnectTracker when the auth browser closes. */
export function useGlobalTrackerDeepLink(
  navigationRef: RefObject<NavigationContainerRef<RootStackParamList> | null>,
  isAuthenticated: boolean,
  navigationReady: boolean,
) {
  const handled = useRef(new Set<string>());

  useEffect(() => {
    if (!isAuthenticated || !navigationReady) return;

    const openFromUrl = (url: string | null) => {
      if (!url || handled.current.has(url)) return;

      const link = parseTrackerConnectLink(url);
      if (!link) return;

      recordConnectLinkUrl(url);

      // connectTracker owns finish while the in-app auth browser is open.
      if (isTrackerOAuthInProgress()) {
        return;
      }

      if (link.pendingToken && isPendingTokenInFlight(link.pendingToken)) {
        return;
      }

      handled.current.add(url);

      const navigate = () => {
        navigationRef.current?.navigate(
          'ConnectTracker',
          connectLinkToRouteParams(link),
        );
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
  }, [isAuthenticated, navigationReady, navigationRef]);
}
