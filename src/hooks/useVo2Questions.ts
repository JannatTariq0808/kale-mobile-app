import { useEffect, useState } from 'react';
import { fetchVo2Questions } from '../services/cardio/fetchVo2Questions';
import type { Vo2Question } from '../types/vo2Question';

export function useVo2Questions() {
  const [items, setItems] = useState<Vo2Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchVo2Questions()
      .then((questions) => {
        if (!cancelled) setItems(questions);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { items, loading };
}
