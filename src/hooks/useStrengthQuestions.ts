import { useEffect, useState } from 'react';
import { fetchStrengthQuestions } from '../services/strength/fetchStrengthQuestions';
import type { StrengthQuestion } from '../types/strengthQuestion';

export function useStrengthQuestions() {
  const [items, setItems] = useState<StrengthQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchStrengthQuestions()
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
