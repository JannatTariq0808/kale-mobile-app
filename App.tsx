import {
  NavigationContainer,
  type NavigationContainerRef,
  type NavigationState,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthDeepLink } from './src/hooks/useAuthDeepLink';
import { useAuthNavigationSync } from './src/hooks/useAuthNavigationSync';
import { useAuthSession } from './src/hooks/useAuthSession';
import { useSoraFonts } from './src/hooks/useSoraFonts';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/navigation/types';
import { AUTH_LINK_PREFIXES } from './src/navigation/linking';
import { SplashView } from './src/components/lumen/SplashView';
import { BackdropAnimatedContext } from './src/navigation/backdropContext';
import { welcomeSurfaceReady } from './src/navigation/welcomeSurface';
import { lumen, navigationFonts } from './src/theme';
import { applySoraFontGlobally } from './src/utils/applySoraFont';
import { defaultAppOrientationLock } from './src/utils/appOrientationLock';
import { hideAndroidSystemNav } from './src/utils/hideAndroidSystemNav';
import { useGlobalTrackerDeepLink } from './src/hooks/useGlobalTrackerDeepLink';
import { useInitialAuthRoute } from './src/hooks/useInitialAuthRoute';
import { usePushNotifications } from './src/hooks/usePushNotifications';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});

/** Screens where the slow breathing curve is worth the GPU cost. */
const ANIMATED_BACKDROP_ROUTES = new Set<keyof RootStackParamList>(['Welcome']);

function isBackdropAnimated(state: NavigationState | undefined) {
  const route = state?.routes[state.index]?.name as keyof RootStackParamList | undefined;
  return route != null && ANIMATED_BACKDROP_ROUTES.has(route);
}

export default function App() {
  const fontsReady = useSoraFonts();
  const { isAuthenticated, isLoading: authLoading, user } = useAuthSession();
  const sessionReady = !authLoading;
  const initialAuthRoute = useInitialAuthRoute(user, sessionReady);
  usePushNotifications(isAuthenticated ? user?.uid : undefined);
  const [navigationReady, setNavigationReady] = useState(false);
  const canMountNav =
    fontsReady && sessionReady && (!isAuthenticated || initialAuthRoute != null);
  const appReady = canMountNav && navigationReady;
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [backdropAnimated, setBackdropAnimated] = useState(false);
  const [appActive, setAppActive] = useState(() => AppState.currentState === 'active');
  const backdropTaskRef = useRef<ReturnType<typeof InteractionManager.runAfterInteractions> | null>(
    null,
  );

  const handleNavigationStateChange = useCallback((state: NavigationState | undefined) => {
    backdropTaskRef.current?.cancel();
    backdropTaskRef.current = null;

    if (!isBackdropAnimated(state)) {
      setBackdropAnimated(false);
      return;
    }

    if (welcomeSurfaceReady) {
      setBackdropAnimated(true);
      return;
    }

    // Static backdrop first — morphing animation starts after first Welcome mount.
    setBackdropAnimated(false);
    backdropTaskRef.current = InteractionManager.runAfterInteractions(() => {
      setBackdropAnimated(true);
    });
  }, []);

  useEffect(() => {
    if (appReady) {
      void SplashScreen.hideAsync();
    }
  }, [appReady]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setAppActive(nextState === 'active');
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!canMountNav) {
      setNavigationReady(false);
    }
  }, [canMountNav]);
  useAuthDeepLink(navigationRef);
  useGlobalTrackerDeepLink(navigationRef, isAuthenticated, navigationReady);
  useAuthNavigationSync(navigationRef, user, sessionReady, navigationReady);

  useEffect(() => {
    if (fontsReady) applySoraFontGlobally();
  }, [fontsReady]);

  useEffect(() => {
    void ScreenOrientation.lockAsync(defaultAppOrientationLock()).catch(
      (error) => {
        if (__DEV__) {
          console.warn('[app] could not lock portrait orientation', error);
        }
      },
    );
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const apply = () => {
      void hideAndroidSystemNav();
    };

    apply();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') apply();
    });

    return () => subscription.remove();
  }, []);

  const authLinking = useMemo(
    () => ({
      prefixes: AUTH_LINK_PREFIXES,
      config: {
        screens: {
          NewPassword: 'open-app/reset-password',
        },
      },
    }),
    [],
  );

  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider style={styles.root}>
      <View style={styles.root}>
        {canMountNav ? (
        <NavigationContainer
          key={isAuthenticated ? 'authed' : 'guest'}
          ref={navigationRef}
          onStateChange={handleNavigationStateChange}
          onReady={() => {
            setNavigationReady(true);
            handleNavigationStateChange(navigationRef.current?.getRootState());
          }}
          linking={isAuthenticated ? undefined : authLinking}
          theme={{
            dark: true,
            colors: {
              primary: lumen.lime,
              background: lumen.bgDeep,
              card: lumen.bgDeep,
              text: lumen.fgMuted,
              border: lumen.hairline,
              notification: lumen.coral,
            },
            fonts: navigationFonts,
          }}
        >
          <BackdropAnimatedContext.Provider value={backdropAnimated && appActive}>
            <RootNavigator
              isAuthenticated={isAuthenticated}
              initialAuthRoute={initialAuthRoute}
            />
          </BackdropAnimatedContext.Provider>
          <StatusBar style="light" backgroundColor={lumen.bgDeep} />
        </NavigationContainer>
        ) : null}
        {!appReady ? (
          <View style={styles.splashOverlay} pointerEvents="none">
            <SplashView />
          </View>
        ) : null}
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
