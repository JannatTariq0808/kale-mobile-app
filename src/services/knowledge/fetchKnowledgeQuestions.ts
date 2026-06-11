import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { KNOWLEDGE_QUESTIONS_FALLBACK } from '../../data/knowledgeQuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { KnowledgeQuestion } from '../../types/knowledgeQuestion';

function mapDoc(id: string, data: Record<string, unknown>): KnowledgeQuestion | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;

  return { id, question, answer, sortOrder, active };
}

/** Reads `knowledgeQuestions` from Firestore (public read). Falls back to bundled copy. */
export async function fetchKnowledgeQuestions(): Promise<KnowledgeQuestion[]> {
  if (!isFirebaseConfigured()) {
    return KNOWLEDGE_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'knowledgeQuestions'), orderBy('sortOrder', 'asc')),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is KnowledgeQuestion => item !== null);

    return items.length > 0 ? items : KNOWLEDGE_QUESTIONS_FALLBACK;
  } catch {
    return KNOWLEDGE_QUESTIONS_FALLBACK;
  }
}
