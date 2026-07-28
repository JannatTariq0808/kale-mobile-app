import { useEffect, useState } from 'react';
import { fetchRunningYearsQuestions } from '../services/runningYears/fetchRunningYearsQuestions';
import type { RunningYearsQuestion } from '../types/runningYearsQuestion';

export function useRunningYearsQuestions() {
  const [items, setItems] = useState<RunningYearsQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchRunningYearsQuestions()
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
