import type { RootStackParamList } from './types';

/** Cold start — main app (Longevity tab is the default home). */
export const APP_INITIAL_STATE = {
  index: 0,
  routes: [{ name: 'Main' as const }],
} satisfies {
  index: number;
  routes: { name: keyof RootStackParamList }[];
};
