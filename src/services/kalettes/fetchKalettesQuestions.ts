import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { KALETTES_QUESTIONS_FALLBACK } from '../../data/kalettesQuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { KalettesQuestion } from '../../types/kalettesQuestion';

function mapDoc(id: string, data: Record<string, unknown>): KalettesQuestion | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;

  return { id, question, answer, sortOrder, active };
}

/** Reads `kalettesQuestions` from Firestore (public read). Falls back to bundled copy. */
export async function fetchKalettesQuestions(): Promise<KalettesQuestion[]> {
  if (!isFirebaseConfigured()) {
    return KALETTES_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'kalettesQuestions'), orderBy('sortOrder', 'asc')),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is KalettesQuestion => item !== null);

    return items.length > 0 ? items : KALETTES_QUESTIONS_FALLBACK;
  } catch {
    return KALETTES_QUESTIONS_FALLBACK;
  }
}
