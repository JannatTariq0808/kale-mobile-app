import { CommonActions } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { isFirebaseConfigured } from '../../config/firebase';
import { getFirebaseAuth } from './firebaseApp';

type NavLike = {
  getParent(): NavLike | undefined;
  dispatch(action: ReturnType<typeof CommonActions.reset>): void;
};

export async function signOutUser(): Promise<void> {
  if (!isFirebaseConfigured()) return;
  await signOut(getFirebaseAuth());
}

/** Reset the root stack to the logged-out entry screen. */
export function resetToWelcome(navigation: NavLike): void {
  let root: NavLike = navigation;
  while (root.getParent()) {
    root = root.getParent()!;
  }

  root.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    }),
  );
}
