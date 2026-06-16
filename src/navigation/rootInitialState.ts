import type { RootStackParamList } from './types';

type RootNavState = {
  index: number;
  routes: { name: keyof RootStackParamList }[];
};

/** Pick the cold-start screen from the restored auth session. */
export function getAppInitialState(isAuthenticated: boolean): RootNavState {
  if (isAuthenticated) {
    return { index: 0, routes: [{ name: 'Main' }] };
  }

  return { index: 0, routes: [{ name: 'Welcome' }] };
}
