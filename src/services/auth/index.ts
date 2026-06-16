import { getFirebaseAuth, loadAuthModule } from './firebaseApp';

export { getFirebaseAuth };

type AuthFns = ReturnType<typeof loadAuthModule>;

function authFns(): AuthFns {
  return loadAuthModule();
}

/** Auth helpers — always from the React Native Firebase bundle (see metro.config.js). */
export const onAuthStateChanged: AuthFns['onAuthStateChanged'] = (...args) =>
  authFns().onAuthStateChanged(...args);

export const signInWithEmailAndPassword: AuthFns['signInWithEmailAndPassword'] = (...args) =>
  authFns().signInWithEmailAndPassword(...args);

export const createUserWithEmailAndPassword: AuthFns['createUserWithEmailAndPassword'] = (...args) =>
  authFns().createUserWithEmailAndPassword(...args);

export const updateProfile: AuthFns['updateProfile'] = (...args) =>
  authFns().updateProfile(...args);

export const signOut: AuthFns['signOut'] = (...args) => authFns().signOut(...args);

export const sendPasswordResetEmail: AuthFns['sendPasswordResetEmail'] = (...args) =>
  authFns().sendPasswordResetEmail(...args);

export const confirmPasswordReset: AuthFns['confirmPasswordReset'] = (...args) =>
  authFns().confirmPasswordReset(...args);

export async function getFirebaseIdToken(): Promise<string | null> {
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken();
}
