import { useEffect, useState } from 'react';
import { fetchKnowledgeQuestions } from '../services/knowledge/fetchKnowledgeQuestions';
import type { KnowledgeQuestion } from '../types/knowledgeQuestion';

export function useKnowledgeQuestions() {
  const [items, setItems] = useState<KnowledgeQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchKnowledgeQuestions()
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
