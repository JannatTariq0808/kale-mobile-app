/** Firestore collection: `rewardsProducts` */
export type RewardsProductTag = 'GEAR' | 'OFFER' | 'ASSESSMENT' | 'COACHING';

export type RewardsProductCategory =
  | 'Gear'
  | 'Partner offers'
  | 'Health assessments'
  | 'Coaching';

export type RewardsProduct = {
  id: string;
  title: string;
  brand: string;
  pts: number;
  topup: number | null;
  category: RewardsProductCategory;
  tag: RewardsProductTag;
  discount?: string;
  imageUrl?: string;
  /** Deep link on kale.insure — opens when the card is tapped */
  productUrl: string;
  sortOrder: number;
  /** Milliseconds since epoch — used for newest-first ordering */
  createdAtMs: number;
  active?: boolean;
};

export type RewardsProductDoc = Omit<RewardsProduct, 'id'>;

export type MarketplaceFilter = 'All' | RewardsProductCategory;

export type RewardsProductsSource = 'firestore' | 'fallback' | 'error';

export type RewardsProductsMeta = {
  source: RewardsProductsSource;
  projectId: string | null;
  /** Raw document count returned by Firestore */
  firestoreDocCount: number;
  /** Documents that passed mapping (active + title) */
  mappedCount: number;
};

export type RewardsProductsFetchResult = {
  items: RewardsProduct[];
  meta: RewardsProductsMeta;
};
