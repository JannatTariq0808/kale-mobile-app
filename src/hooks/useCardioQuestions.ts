import { useEffect, useState } from 'react';
import { fetchCardioQuestions } from '../services/cardio/fetchCardioQuestions';
import type { CardioQuestion } from '../types/cardioQuestion';

export function useCardioQuestions() {
  const [items, setItems] = useState<CardioQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCardioQuestions()
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
