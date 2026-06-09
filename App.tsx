import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSoraFonts } from './src/hooks/useSoraFonts';
import { RootNavigator } from './src/navigation/RootNavigator';
import { lumen, navigationFonts } from './src/theme';
import { applySoraFontGlobally } from './src/utils/applySoraFont';
import { hideAndroidSystemNav } from './src/utils/hideAndroidSystemNav';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lumen.bgDark,
  },
});

export default function App() {
  const fontsReady = useSoraFonts();

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
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider style={styles.root}>
      <View style={styles.root}>
        <NavigationContainer
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
          <RootNavigator />
          <StatusBar style="light" backgroundColor={lumen.bgDark} />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
