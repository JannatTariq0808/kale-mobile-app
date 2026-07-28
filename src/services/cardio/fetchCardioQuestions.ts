import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { CARDIO_QUESTIONS_FALLBACK } from '../../data/cardioQuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { CardioQuestion } from '../../types/cardioQuestion';

function mapDoc(id: string, data: Record<string, unknown>): CardioQuestion | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;

  return { id, question, answer, sortOrder, active };
}

/** Reads `cardioQuestions` from Firestore. Falls back to bundled copy. */
export async function fetchCardioQuestions(): Promise<CardioQuestion[]> {
  if (!isFirebaseConfigured()) {
    return CARDIO_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'cardioQuestions'), orderBy('sortOrder', 'asc')),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is CardioQuestion => item !== null);

    return items.length > 0 ? items : CARDIO_QUESTIONS_FALLBACK;
  } catch {
    return CARDIO_QUESTIONS_FALLBACK;
  }
}
