import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { ClaimScreen } from '../screens/policy/ClaimScreen';
import { PauseRequestScreen } from '../screens/policy/PauseRequestScreen';
import { PolicyScreen } from '../screens/policy/PolicyScreen';
import { framed } from './framedScreen';
import { SettingsStackNavigator } from './SettingsStackNavigator';
import { kalettesStackScreenOptions } from './stackScreenOptions';

export type PolicyStackParamList = {
  /** 22 · My policy */
  Policy: undefined;
  /** 24 · Make or update a claim */
  Claim: undefined;
  /** 25 · Request a pause */
  Pause: undefined;
  /** Profile, notifications, log out — Settings loses its tab for IP customers */
  Settings: undefined;
};

/** Full-bleed flow screens: tab bar hidden. */
export const POLICY_FLOW_ROUTES: (keyof PolicyStackParamList)[] = ['Claim', 'Pause'];

export function shouldHideTabBarForPolicyRoute(routeName: string | undefined): boolean {
  if (!routeName) return false;
  return (POLICY_FLOW_ROUTES as string[]).includes(routeName);
}

const Stack = createNativeStackNavigator<PolicyStackParamList>();

export function PolicyStackNavigator() {
  return (
    <View style={styles.shell}>
      <Stack.Navigator screenOptions={kalettesStackScreenOptions}>
        <Stack.Screen name="Policy" component={framed(PolicyScreen)} />
        <Stack.Screen name="Claim" component={framed(ClaimScreen)} />
        <Stack.Screen name="Pause" component={framed(PauseRequestScreen)} />
        <Stack.Screen name="Settings" component={SettingsStackNavigator} />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
