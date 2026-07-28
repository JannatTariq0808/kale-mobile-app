import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { isFirebaseConfigured } from '../../config/firebase';
import { RUNNING_YEARS_QUESTIONS_FALLBACK } from '../../data/runningYearsQuestionsFallback';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import type { RunningYearsQuestion } from '../../types/runningYearsQuestion';

function mapDoc(id: string, data: Record<string, unknown>): RunningYearsQuestion | null {
  const question = typeof data.question === 'string' ? data.question : '';
  const answer = typeof data.answer === 'string' ? data.answer : '';
  const sortOrder = typeof data.sortOrder === 'number' ? data.sortOrder : 0;
  const active = data.active !== false;

  if (!question || !answer || !active) return null;
  return { id, question, answer, sortOrder, active };
}

/** Reads `runningYearsQuestions` from Firestore. Falls back to bundled copy. */
export async function fetchRunningYearsQuestions(): Promise<RunningYearsQuestion[]> {
  if (!isFirebaseConfigured()) {
    return RUNNING_YEARS_QUESTIONS_FALLBACK;
  }

  try {
    const snap = await getDocs(
      query(collection(getFirebaseFirestore(), 'runningYearsQuestions'), orderBy('sortOrder', 'asc')),
    );
    const items = snap.docs
      .map((doc) => mapDoc(doc.id, doc.data() as Record<string, unknown>))
      .filter((item): item is RunningYearsQuestion => item !== null);
    return items.length > 0 ? items : RUNNING_YEARS_QUESTIONS_FALLBACK;
  } catch {
    return RUNNING_YEARS_QUESTIONS_FALLBACK;
  }
}
