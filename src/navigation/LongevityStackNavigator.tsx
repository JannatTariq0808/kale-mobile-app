import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { LongevityScreen } from '../screens/LongevityScreen';
import { RunningYearsEmptyScreen } from '../screens/runningYears/RunningYearsEmptyScreen';
import { RunningYearsGoalScreen } from '../screens/runningYears/RunningYearsGoalScreen';
import { RunningYearsIntroScreen } from '../screens/runningYears/RunningYearsIntroScreen';
import { RunningYearsMainScreen } from '../screens/runningYears/RunningYearsMainScreen';
import { kalettesStackScreenOptions } from './stackScreenOptions';

export type LongevityStackParamList = {
  Home: undefined;
  RunningYearsIntro: undefined;
  RunningYearsGoal: undefined;
  RunningYearsMain: undefined;
  RunningYearsEmpty: undefined;
};

const Stack = createNativeStackNavigator<LongevityStackParamList>();

export function LongevityStackNavigator() {
  return (
    <View style={styles.shell}>
      <Stack.Navigator screenOptions={kalettesStackScreenOptions}>
        <Stack.Screen name="Home" component={LongevityScreen} />
        <Stack.Screen name="RunningYearsIntro" component={RunningYearsIntroScreen} />
        <Stack.Screen name="RunningYearsGoal" component={RunningYearsGoalScreen} />
        <Stack.Screen name="RunningYearsMain" component={RunningYearsMainScreen} />
        <Stack.Screen name="RunningYearsEmpty" component={RunningYearsEmptyScreen} />
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
