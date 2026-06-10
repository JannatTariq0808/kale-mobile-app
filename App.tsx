import {
  NavigationContainer,
  type NavigationContainerRef,
  type NavigationState,
} from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthDeepLink } from './src/hooks/useAuthDeepLink';
import { useSoraFonts } from './src/hooks/useSoraFonts';
import { RootNavigator } from './src/navigation/RootNavigator';
import type { RootStackParamList } from './src/navigation/types';
import { AUTH_LINK_PREFIXES } from './src/navigation/linking';
import { ResponsiveAppFrame } from './src/components/layout/ResponsiveAppFrame';
import { SplashView } from './src/components/lumen/SplashView';
import { BackdropAnimatedContext } from './src/navigation/backdropContext';
import { lumen, navigationFonts } from './src/theme';
import { applySoraFontGlobally } from './src/utils/applySoraFont';
import { hideAndroidSystemNav } from './src/utils/hideAndroidSystemNav';
import { ensureFirebase } from './src/services/auth/firebaseApp';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lumen.bgDark,
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
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const [backdropAnimated, setBackdropAnimated] = useState(false);
  const [appActive, setAppActive] = useState(() => AppState.currentState === 'active');

  const handleNavigationStateChange = useCallback((state: NavigationState | undefined) => {
    setBackdropAnimated(isBackdropAnimated(state));
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      setAppActive(nextState === 'active');
    });

    return () => subscription.remove();
  }, []);

  useAuthDeepLink(navigationRef);

  useEffect(() => {
    ensureFirebase();
  }, []);

  useEffect(() => {
    if (fontsReady) applySoraFontGlobally();
  }, [fontsReady]);

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

  if (!fontsReady) {
    return <SplashView />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider style={styles.root}>
      <View style={styles.root}>
        <NavigationContainer
          ref={navigationRef}
          onStateChange={handleNavigationStateChange}
          onReady={() => {
            setBackdropAnimated(isBackdropAnimated(navigationRef.current?.getRootState()));
          }}
          linking={{
            prefixes: AUTH_LINK_PREFIXES,
            config: {
              screens: {
                NewPassword: 'reset-password',
              },
            },
          }}
          theme={{
            dark: true,
            colors: {
              primary: lumen.lime,
              background: lumen.bgDark,
              card: lumen.bgDark,
              text: lumen.fgMuted,
              border: lumen.hairline,
              notification: lumen.coral,
            },
            fonts: navigationFonts,
          }}
        >
          <BackdropAnimatedContext.Provider value={backdropAnimated && appActive}>
            <ResponsiveAppFrame>
              <RootNavigator />
            </ResponsiveAppFrame>
          </BackdropAnimatedContext.Provider>
          <StatusBar style="light" backgroundColor={lumen.bgDark} />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
