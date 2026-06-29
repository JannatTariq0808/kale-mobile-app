import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { getQuestionSetFallback } from '../../data/questionSetFallback';
import type { QuestionSetCategory, QuestionSetQuestion } from '../../types/questionSet';
import { getFirebaseFirestore } from '../auth/firebaseApp';

function parseCategory(raw: unknown): QuestionSetCategory | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const data = raw as Record<string, unknown>;
  return {
    label: typeof data.label === 'string' ? data.label : undefined,
    month: typeof data.month === 'number' ? data.month : undefined,
    type: typeof data.type === 'string' ? data.type : undefined,
  };
}

function mapDoc(id: string, data: Record<string, unknown>): QuestionSetQuestion | null {
  const text = typeof data.text === 'string' ? data.text.trim() : '';
  const options = Array.isArray(data.options)
    ? data.options.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];
  const correct = typeof data.correct === 'number' ? data.correct : -1;
  const order = typeof data.order === 'number' ? data.order : 0;
  const set = typeof data.set === 'string' ? data.set.trim().toLowerCase() : '';
  const status = typeof data.status === 'string' ? data.status.trim() : '';
  const explanation = typeof data.explanation === 'string' ? data.explanation.trim() : '';

  if (!text || options.length < 2 || correct < 0 || correct >= options.length) {
    return null;
  }

  if (status && status.toLowerCase() !== 'active') {
    return null;
  }

  return {
    id,
    text,
    options,
    correct,
    order,
    set,
    status: status || 'Active',
    explanation,
    category: parseCategory(data.category),
  };
}

/** Reads active questions for a set from Firestore `questionSets`. */
export async function fetchQuestionSet(setId: string): Promise<QuestionSetQuestion[]> {
  const normalizedSetId = setId.trim().toLowerCase();
  const fallback = getQuestionSetFallback(normalizedSetId);

  if (!isFirebaseConfigured()) {
    return fallback;
  }

  try {
    const snap = await getDocs(
      query(
        collection(getFirebaseFirestore(), 'questionSets'),
        where('set', '==', normalizedSetId),
        orderBy('order', 'asc'),
      ),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is QuestionSetQuestion => item !== null);

    return items.length > 0 ? items : fallback;
  } catch {
    try {
      const snap = await getDocs(
        query(collection(getFirebaseFirestore(), 'questionSets'), where('set', '==', normalizedSetId)),
      );

      const items = snap.docs
        .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
        .filter((item): item is QuestionSetQuestion => item !== null)
        .sort((a, b) => a.order - b.order);

      return items.length > 0 ? items : fallback;
    } catch {
      return fallback;
    }
  }
}
