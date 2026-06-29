import { useEffect, useState } from 'react';
import { fetchQuestionSet } from '../services/knowledge/fetchQuestionSet';
import type { QuestionSetQuestion } from '../types/questionSet';

export function useQuestionSet(setId: string) {
  const [questions, setQuestions] = useState<QuestionSetQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchQuestionSet(setId)
      .then((items) => {
        if (cancelled) return;
        setQuestions(items);
        if (items.length === 0) {
          setError('No questions are available for this assessment yet.');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load questions. Check your connection and try again.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setId]);

  return { questions, loading, error };
}
