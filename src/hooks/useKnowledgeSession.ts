import { useEffect, useState } from 'react';
import { fetchKnowledgeAssessmentForSet } from '../services/knowledge/knowledgeAssessmentSession';
import type { KnowledgeAssessment } from '../types/knowledgeAssessment';

export function useKnowledgeSession(uid: string | null | undefined, setId: string) {
  const [assessment, setAssessment] = useState<KnowledgeAssessment | null>(null);
  const [loading, setLoading] = useState(Boolean(uid));

  useEffect(() => {
    if (!uid) {
      setAssessment(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchKnowledgeAssessmentForSet(uid, setId)
      .then((value) => {
        if (!cancelled) setAssessment(value);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uid, setId]);

  return { assessment, loading };
}
