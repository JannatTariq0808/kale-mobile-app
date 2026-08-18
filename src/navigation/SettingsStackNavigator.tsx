import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { SettingsProfileScreen } from '../screens/settings/SettingsProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { kalettesStackScreenOptions } from './stackScreenOptions';

export type SettingsStackParamList = {
  Main: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStackNavigator() {
  return (
    <View style={styles.shell}>
      <Stack.Navigator screenOptions={kalettesStackScreenOptions}>
        <Stack.Screen name="Main" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={SettingsProfileScreen} />
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
