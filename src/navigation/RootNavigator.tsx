import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { LumenWelcomeBackground } from '../components/lumen/LumenWelcomeBackground';
import { BackdropAnimatedContext } from './backdropContext';
import { NewPasswordScreen } from '../screens/auth/NewPasswordScreen';
import { ResetPasswordScreen } from '../screens/auth/ResetPasswordScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { FirstCycleRewardsScreen } from '../screens/onboarding/FirstCycleRewardsScreen';
import { HealthYearsScreen } from '../screens/onboarding/HealthYearsScreen';
import { LevelRevealScreen } from '../screens/onboarding/LevelRevealScreen';
import { KnowledgeAnalysingScreen } from '../screens/onboarding/KnowledgeAnalysingScreen';
import { KnowledgeIntroScreen } from '../screens/onboarding/KnowledgeIntroScreen';
import { KnowledgeQuizScreen } from '../screens/onboarding/KnowledgeQuizScreen';
import { ConnectTrackerScreen } from '../screens/onboarding/ConnectTrackerScreen';
import { CardioAnalysingScreen } from '../screens/onboarding/CardioAnalysingScreen';
import { SignInScreen } from '../screens/onboarding/SignInScreen';
import { StrengthAnalysingScreen } from '../screens/onboarding/StrengthAnalysingScreen';
import { StrengthIntroScreen } from '../screens/onboarding/StrengthIntroScreen';
import { StrengthRecordScreen } from '../screens/onboarding/StrengthRecordScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { KnowledgeResultScreen } from '../screens/result/KnowledgeResultScreen';
import { CardioResultScreen } from '../screens/result/CardioResultScreen';
import { StrengthResultScreen } from '../screens/result/StrengthResultScreen';
import { lumen } from '../theme';
import { rootStackScreenOptions } from './stackScreenOptions';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

type RootNavigatorProps = {
  isAuthenticated: boolean;
  initialAuthRoute: keyof RootStackParamList | null;
};

export function RootNavigator({ isAuthenticated, initialAuthRoute }: RootNavigatorProps) {
  const backdropAnimated = useContext(BackdropAnimatedContext);

  const initialRouteName = isAuthenticated
    ? (initialAuthRoute ?? 'Main')
    : 'Welcome';

  return (
    <View style={styles.root}>
      <LumenWelcomeBackground animated={backdropAnimated} />
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={rootStackScreenOptions}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen
          name="NewPassword"
          component={NewPasswordScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="ConnectTracker" component={ConnectTrackerScreen} />
        <Stack.Screen name="CardioAnalysing" component={CardioAnalysingScreen} />
        <Stack.Screen name="CardioResult" component={CardioResultScreen} />
        <Stack.Screen name="StrengthIntro" component={StrengthIntroScreen} />
        <Stack.Screen
          name="StrengthRecord"
          component={StrengthRecordScreen}
          options={{ gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen name="StrengthAnalysing" component={StrengthAnalysingScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="StrengthResult" component={StrengthResultScreen} />
        <Stack.Screen name="KnowledgeIntro" component={KnowledgeIntroScreen} />
        <Stack.Screen
          name="KnowledgeQuiz"
          component={KnowledgeQuizScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="KnowledgeAnalysing" component={KnowledgeAnalysingScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="KnowledgeResult" component={KnowledgeResultScreen} />
        <Stack.Screen name="LevelReveal" component={LevelRevealScreen} />
        <Stack.Screen name="HealthYears" component={HealthYearsScreen} />
        <Stack.Screen name="FirstCycleRewards" component={FirstCycleRewardsScreen} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            contentStyle: styles.transparentScreen,
            animation: 'none',
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lumen.bgDeep,
  },
  transparentScreen: {
    backgroundColor: 'transparent',
  },
});
