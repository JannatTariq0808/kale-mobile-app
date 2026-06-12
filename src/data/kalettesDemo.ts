import type { MarketplaceFilter } from '../types/rewardsProduct';

/** Design: lum-16 / lum-17 · Rewards Balance + Marketplace */
export const kalettesDemo = {
  balance: 486,
  gbpEstimate: '≈ £4.86',
  cycleWeeksLeft: '9 weeks left',
  toBankPts: 486,
  cycleProgressPct: 30,
  rewardsUrl: 'https://www.kale.insure/rewards',
  categories: [
    'All',
    'Gear',
    'Partner offers',
    'Health assessments',
    'Coaching',
  ] as MarketplaceFilter[],
} as const;
