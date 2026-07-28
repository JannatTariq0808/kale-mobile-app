import type { NavigationProp, ParamListBase } from '@react-navigation/native';
import type { LongevityStackParamList } from '../../navigation/LongevityStackNavigator';
import { getFirebaseAuth } from '../auth/firebaseApp';
import { fetchCardioSummary } from '../cardio/fetchCardioSummary';
import { readManualRestingHr, readRunningYearsGoal } from './runningYearsStorage';

export type RunningYearsRoute = keyof Pick<
  LongevityStackParamList,
  'RunningYearsIntro' | 'RunningYearsGoal' | 'RunningYearsMain' | 'RunningYearsEmpty'
>;

export async function resolveRunningYearsRoute(uid: string): Promise<RunningYearsRoute> {
  const [summary, restingHr, goal] = await Promise.all([
    fetchCardioSummary(uid),
    readManualRestingHr(uid),
    readRunningYearsGoal(uid),
  ]);

  const hasDevice = summary?.platform != null || restingHr != null;
  if (!hasDevice) return 'RunningYearsEmpty';
  if (goal) return 'RunningYearsMain';
  return 'RunningYearsIntro';
}

function navigateToRunningYears(
  navigation: NavigationProp<ParamListBase>,
  route: RunningYearsRoute,
): void {
  try {
    const state = navigation.getState?.();
    const routeNames = state?.routeNames as string[] | undefined;

    if (routeNames?.includes(route)) {
      navigation.navigate(route as never);
      return;
    }

    // Home screen may be holding the tab navigator — push into Longevity stack.
    navigation.navigate('Longevity' as never, { screen: route } as never);
  } catch (error) {
    if (__DEV__) {
      console.warn('[runningYears] navigate failed', route, error);
    }
  }
}

type OpenRunningYearsOptions = {
  goalSet?: boolean;
  hasDevice?: boolean;
};

/**
 * Instant navigation — never waits on Firestore before pushing a screen.
 * (Previously "Explore" awaited cardio summary and felt broken / multi-tap.)
 */
export function openRunningYears(
  navigation: NavigationProp<ParamListBase>,
  options?: OpenRunningYearsOptions,
): void {
  if (options?.goalSet === false) {
    navigateToRunningYears(navigation, 'RunningYearsGoal');
    return;
  }

  if (options?.goalSet === true) {
    // Explore CTA — open main immediately; empty only when we already know no device.
    navigateToRunningYears(
      navigation,
      options.hasDevice === false ? 'RunningYearsEmpty' : 'RunningYearsMain',
    );
    return;
  }

  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    navigateToRunningYears(navigation, 'RunningYearsIntro');
    return;
  }

  // Unknown state: go intro now, refine in background if needed.
  navigateToRunningYears(navigation, 'RunningYearsIntro');
  void resolveRunningYearsRoute(uid)
    .then((route) => {
      if (route !== 'RunningYearsIntro') {
        navigateToRunningYears(navigation, route);
      }
    })
    .catch((error) => {
      if (__DEV__) {
        console.warn('[runningYears] resolve failed', error);
      }
    });
}
