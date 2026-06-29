import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

const POLL_INTERVAL_MS = 2000;
const MAX_WAIT_MS = 60_000;

function isCardioReady(status: string | null): boolean {
  return status === 'level_assigned' || status === 'no_eligible' || status === 'no_activities';
}

async function fetchCardioStatus(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(getFirebaseFirestore(), 'cardios', uid));
  if (!snap.exists()) return null;
  const status = snap.data()?.assessmentStatus;
  return typeof status === 'string' ? status : null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Poll cardios/{uid} until the backend finishes assessment or we time out. */
export async function waitForCardioAssessmentReady(uid: string): Promise<string | null> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < MAX_WAIT_MS) {
    const status = await fetchCardioStatus(uid);
    if (isCardioReady(status)) {
      return status;
    }
    await sleep(POLL_INTERVAL_MS);
  }

  return fetchCardioStatus(uid);
}
