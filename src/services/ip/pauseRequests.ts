import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseFirestore } from '../auth/firebaseApp';

export type PauseReason = 'maternity_paternity' | 'medical_advice' | 'other';

export const PAUSE_REASONS: { value: PauseReason; label: string }[] = [
  { value: 'maternity_paternity', label: 'Maternity or paternity leave' },
  { value: 'medical_advice', label: 'Medical advice' },
  { value: 'other', label: 'Other' },
];

export type PauseRequestInput = {
  uid: string;
  reason: PauseReason;
  expectedReturnDate: Date;
  prospectId: string | null;
  policyId: string | null;
};

/**
 * Queues a pause request for Kale ops (target decision within five working days).
 * Collection: pauseRequests — authenticated users may create, never read or update.
 */
export async function submitPauseRequest(input: PauseRequestInput): Promise<string> {
  const ref = await addDoc(collection(getFirebaseFirestore(), 'pauseRequests'), {
    uid: input.uid,
    reason: input.reason,
    expectedReturnDate: input.expectedReturnDate,
    prospectId: input.prospectId,
    policyId: input.policyId,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}
