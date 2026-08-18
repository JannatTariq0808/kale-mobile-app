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
import { framed } from './framedScreen';
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
        <Stack.Screen name="Welcome" component={framed(WelcomeScreen)} />
        <Stack.Screen name="SignIn" component={framed(SignInScreen)} />
        <Stack.Screen name="SignUp" component={framed(SignUpScreen)} />
        <Stack.Screen name="ResetPassword" component={framed(ResetPasswordScreen)} />
        <Stack.Screen
          name="NewPassword"
          component={framed(NewPasswordScreen)}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="ConnectTracker" component={framed(ConnectTrackerScreen)} />
        <Stack.Screen
          name="CardioAnalysing"
          component={framed(CardioAnalysingScreen)}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="CardioResult"
          component={framed(CardioResultScreen)}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="StrengthIntro" component={framed(StrengthIntroScreen)} />
        <Stack.Screen
          name="StrengthRecord"
          component={StrengthRecordScreen}
          options={{ gestureEnabled: false, animation: 'fade' }}
        />
        <Stack.Screen name="StrengthAnalysing" component={framed(StrengthAnalysingScreen)} options={{ gestureEnabled: false }} />
        <Stack.Screen name="StrengthResult" component={framed(StrengthResultScreen)} />
        <Stack.Screen name="KnowledgeIntro" component={framed(KnowledgeIntroScreen)} />
        <Stack.Screen
          name="KnowledgeQuiz"
          component={framed(KnowledgeQuizScreen)}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="KnowledgeAnalysing" component={framed(KnowledgeAnalysingScreen)} options={{ gestureEnabled: false }} />
        <Stack.Screen name="KnowledgeResult" component={framed(KnowledgeResultScreen)} />
        <Stack.Screen name="LevelReveal" component={framed(LevelRevealScreen)} />
        <Stack.Screen name="HealthYears" component={framed(HealthYearsScreen)} />
        <Stack.Screen name="FirstCycleRewards" component={framed(FirstCycleRewardsScreen)} />
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
