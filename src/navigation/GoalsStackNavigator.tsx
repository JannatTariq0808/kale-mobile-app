import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { AddGoalScreen } from '../screens/goals/AddGoalScreen';
import { CoachingScreen } from '../screens/goals/CoachingScreen';
import { GoalsScreen } from '../screens/goals/GoalsScreen';
import { framed } from './framedScreen';
import { kalettesStackScreenOptions } from './stackScreenOptions';

export type GoalsStackParamList = {
  /** Goals · with a coach */
  GoalsHome: undefined;
  /** Goals · add a goal */
  AddGoal: undefined;
  /** 1 to 1 coaching · request */
  Coaching: undefined;
};

/** Full-bleed flow screens: tab bar hidden. */
const GOALS_FLOW_ROUTES: (keyof GoalsStackParamList)[] = ['AddGoal', 'Coaching'];

export function shouldHideTabBarForGoalsRoute(routeName: string | undefined): boolean {
  if (!routeName) return false;
  return (GOALS_FLOW_ROUTES as string[]).includes(routeName);
}

const Stack = createNativeStackNavigator<GoalsStackParamList>();

export function GoalsStackNavigator() {
  return (
    <View style={styles.shell}>
      <Stack.Navigator screenOptions={kalettesStackScreenOptions}>
        <Stack.Screen name="GoalsHome" component={framed(GoalsScreen)} />
        <Stack.Screen name="AddGoal" component={framed(AddGoalScreen)} />
        <Stack.Screen name="Coaching" component={framed(CoachingScreen)} />
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
