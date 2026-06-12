import { useEffect, useState } from 'react';
import {
  fetchRewardsProducts,
  getCachedRewardsProducts,
} from '../services/kalettes/fetchRewardsProducts';
import type { RewardsProduct, RewardsProductsMeta } from '../types/rewardsProduct';

const EMPTY_META: RewardsProductsMeta = {
  source: 'firestore',
  projectId: null,
  firestoreDocCount: 0,
  mappedCount: 0,
};

export function useRewardsProducts() {
  const [items, setItems] = useState<RewardsProduct[]>(
    () => getCachedRewardsProducts()?.items ?? [],
  );
  const [meta, setMeta] = useState<RewardsProductsMeta>(
    () => getCachedRewardsProducts()?.meta ?? EMPTY_META,
  );
  const [loading, setLoading] = useState(() => !getCachedRewardsProducts());

  useEffect(() => {
    if (getCachedRewardsProducts()) return;

    let cancelled = false;

    fetchRewardsProducts()
      .then(({ items: products, meta: fetchMeta }) => {
        if (!cancelled) {
          setItems(products);
          setMeta(fetchMeta);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, meta, loading };
}
