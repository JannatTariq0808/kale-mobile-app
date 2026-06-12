import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { KalettesBalanceScreen } from '../screens/kalettes/KalettesBalanceScreen';
import { KalettesMarketplaceScreen } from '../screens/kalettes/KalettesMarketplaceScreen';
import { kalettesStackScreenOptions } from './stackScreenOptions';

export type KalettesStackParamList = {
  /** lum-16 · Rewards · Balance — default Kalettes tab */
  Balance: undefined;
  /** lum-17 · Rewards · Marketplace — in-app preview, linked from Balance */
  Marketplace: undefined;
};

const Stack = createNativeStackNavigator<KalettesStackParamList>();

export function KalettesStackNavigator() {
  return (
    <View style={styles.shell}>
      <Stack.Navigator screenOptions={kalettesStackScreenOptions}>
        <Stack.Screen name="Balance" component={KalettesBalanceScreen} />
        <Stack.Screen name="Marketplace" component={KalettesMarketplaceScreen} />
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
