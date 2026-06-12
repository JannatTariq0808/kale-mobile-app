import {
  CommonActions,
  StackActions,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { signOut } from 'firebase/auth';
import { isFirebaseConfigured } from '../../config/firebase';
import { getFirebaseAuth } from './firebaseApp';

/** Any navigation object from `useNavigation()` / screen props. */
export type SessionNavigation = NavigationProp<ParamListBase>;

export function getRootNavigation(navigation: SessionNavigation): SessionNavigation {
  let root = navigation;
  while (root.getParent()) {
    root = root.getParent() as SessionNavigation;
  }
  return root;
}

function canPopToWelcome(root: SessionNavigation): boolean {
  const state = root.getState();
  if (!state || state.index < 1) return false;
  return state.routes[0]?.name === 'Welcome';
}

export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await signOut(getFirebaseAuth());
}

/** Reset the root stack to the logged-out entry screen (fallback when Welcome is not kept below Main). */
export function resetToWelcome(navigation: SessionNavigation): void {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    }),
  );
}

/** Enter the main app home screen after onboarding. */
export function enterMainApp(navigation: SessionNavigation): void {
  getRootNavigation(navigation).dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    }),
  );
}

/**
 * Logout → Welcome: pop Main off the stack when Welcome is already underneath
 * (near-instant), otherwise fall back to a full reset.
 */
export function logoutAndReturnToWelcome(navigation: SessionNavigation): void {
  const root = getRootNavigation(navigation);

  if (canPopToWelcome(root)) {
    root.dispatch(StackActions.pop());
  } else {
    resetToWelcome(navigation);
  }

  InteractionManager.runAfterInteractions(() => {
    void signOutUser();
  });
}
