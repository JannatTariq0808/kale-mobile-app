import type { LongevityStackParamList } from './LongevityStackNavigator';

/** Running Years flow screens — tab bar hidden, full-bleed layout. */
export const RUNNING_YEARS_FLOW_ROUTES: (keyof LongevityStackParamList)[] = [
  'RunningYearsIntro',
  'RunningYearsGoal',
  'RunningYearsMain',
  'RunningYearsEmpty',
];

export function shouldHideTabBarForLongevityRoute(routeName: string | undefined): boolean {
  if (!routeName) return false;
  return (RUNNING_YEARS_FLOW_ROUTES as string[]).includes(routeName);
}
