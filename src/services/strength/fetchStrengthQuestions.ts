import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { STRENGTH_QUESTIONS_FALLBACK } from '../../data/strengthQuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { StrengthQuestion } from '../../types/strengthQuestion';

function mapDoc(id: string, data: Record<string, unknown>): StrengthQuestion | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;

  return { id, question, answer, sortOrder, active };
}

/** Reads `strengthQuestions` from Firestore (public read). Falls back to bundled copy. */
export async function fetchStrengthQuestions(): Promise<StrengthQuestion[]> {
  if (!isFirebaseConfigured()) {
    return STRENGTH_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'strengthQuestions'), orderBy('sortOrder', 'asc')),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is StrengthQuestion => item !== null);

    return items.length > 0 ? items : STRENGTH_QUESTIONS_FALLBACK;
  } catch {
    return STRENGTH_QUESTIONS_FALLBACK;
  }
}
