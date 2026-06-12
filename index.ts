import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { registerRootComponent } from 'expo';

enableScreens(true);
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import App from './App';

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 0, fade: false });
void SystemUI.setBackgroundColorAsync('#004C4C');

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
