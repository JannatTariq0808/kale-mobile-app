import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { VO2_QUESTIONS_FALLBACK } from '../../data/vo2QuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { Vo2Question } from '../../types/vo2Question';

function mapDoc(id: string, data: Record<string, unknown>): Vo2Question | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;

  return { id, question, answer, sortOrder, active };
}

/** Reads `vo2Questions` from Firestore. Falls back to bundled copy. */
export async function fetchVo2Questions(): Promise<Vo2Question[]> {
  if (!isFirebaseConfigured()) {
    return VO2_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'vo2Questions'), orderBy('sortOrder', 'asc')),
    );

    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is Vo2Question => item !== null);

    return items.length > 0 ? items : VO2_QUESTIONS_FALLBACK;
  } catch {
    return VO2_QUESTIONS_FALLBACK;
  }
}
