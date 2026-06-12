import { useEffect, useState } from 'react';
import { fetchKalettesQuestions } from '../services/kalettes/fetchKalettesQuestions';
import type { KalettesQuestion } from '../types/kalettesQuestion';

export function useKalettesQuestions() {
  const [items, setItems] = useState<KalettesQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchKalettesQuestions()
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
