import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KnowledgeAnalysingScreen } from '../screens/onboarding/KnowledgeAnalysingScreen';
import { KnowledgeIntroScreen } from '../screens/onboarding/KnowledgeIntroScreen';
import { KnowledgeQuizScreen } from '../screens/onboarding/KnowledgeQuizScreen';
import { CardioAnalysingScreen } from '../screens/onboarding/CardioAnalysingScreen';
import { SignInScreen } from '../screens/onboarding/SignInScreen';
import { StrengthAnalysingScreen } from '../screens/onboarding/StrengthAnalysingScreen';
import { StrengthIntroScreen } from '../screens/onboarding/StrengthIntroScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { KnowledgeResultScreen } from '../screens/result/KnowledgeResultScreen';
import { CardioResultScreen } from '../screens/result/CardioResultScreen';
import { StrengthResultScreen } from '../screens/result/StrengthResultScreen';
import { TabNavigator } from './TabNavigator';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="CardioAnalysing" component={CardioAnalysingScreen} />
      <Stack.Screen name="CardioResult" component={CardioResultScreen} />
      <Stack.Screen name="StrengthIntro" component={StrengthIntroScreen} />
      <Stack.Screen name="StrengthAnalysing" component={StrengthAnalysingScreen} />
      <Stack.Screen name="StrengthResult" component={StrengthResultScreen} />
      <Stack.Screen name="KnowledgeIntro" component={KnowledgeIntroScreen} />
      <Stack.Screen name="KnowledgeQuiz" component={KnowledgeQuizScreen} />
      <Stack.Screen name="KnowledgeAnalysing" component={KnowledgeAnalysingScreen} />
      <Stack.Screen name="KnowledgeResult" component={KnowledgeResultScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
    </Stack.Navigator>
  );
}
