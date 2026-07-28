import {
  CommonActions,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import { Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { isFirebaseConfigured } from '../../config/firebase';
import { clearActiveAssessmentFlow } from '../assessment/assessmentFlowSession';
import { finalizeOnboardingAssessmentIfReady } from '../onboarding/onboardingPillarStatus';
import { markOnboardingComplete } from '../onboarding/onboardingState';
import { getFirebaseAuth, loadAuthModule } from './firebaseApp';

/** Any navigation object from `useNavigation()` / screen props. */
export type SessionNavigation = NavigationProp<ParamListBase>;

export function getRootNavigation(navigation: SessionNavigation): SessionNavigation {
  let root = navigation;
  while (root.getParent()) {
    root = root.getParent() as SessionNavigation;
  }
  return root;
}

export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const { signOut } = loadAuthModule();
  await signOut(getFirebaseAuth());
}

/** Reset the root stack to the logged-out entry screen. */
export function resetToWelcome(navigation: SessionNavigation): void {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    }),
  );
}

/** Enter the main app home screen after LevelReveal → HealthYears → FirstCycleRewards. */
export function enterMainApp(navigation: SessionNavigation): void {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (uid) {
    void markOnboardingComplete(uid);
    // Persist assessment completion so later logins don't reopen LevelReveal.
    void finalizeOnboardingAssessmentIfReady(uid);
  }
  clearActiveAssessmentFlow();

  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    }),
  );
}

/**
 * Logout → Welcome.
 *
 * Sign out first so App remounts NavigationContainer with the guest key (Welcome).
 * Navigating to Welcome while still authenticated races useAuthNavigationSync and
 * can leave a blank green shell on iOS.
 */
export function logoutAndReturnToWelcome(_navigation?: SessionNavigation): void {
  void (async () => {
    try {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } catch (error) {
      if (__DEV__ && Platform.OS === 'ios') {
        console.warn('[auth] could not lock portrait on logout', error);
      }
    }

    try {
      await signOutUser();
    } catch (error) {
      if (__DEV__) {
        console.warn('[auth] sign out failed', error);
      }
    }
  })();
}
