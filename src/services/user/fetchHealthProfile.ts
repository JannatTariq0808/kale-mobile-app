import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';

export type HealthProfileForAssess = {
  gender: string;
  date_of_birth: string;
  weight_kg: number;
};

function formatDateOfBirth(value: unknown): string | null {
  if (value instanceof Timestamp) {
    const date = value.toDate();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return null;
}

function normalizeGender(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  return value.trim();
}

export async function fetchHealthProfileForAssess(): Promise<HealthProfileForAssess | null> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return null;

  const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  const gender = normalizeGender(data.gender);
  const date_of_birth = formatDateOfBirth(data.dateOfBirth);
  const weight_kg =
    typeof data.weightKg === 'number'
      ? data.weightKg
      : typeof data.weightKg === 'string'
        ? Number(data.weightKg)
        : NaN;

  if (!gender || !date_of_birth || !Number.isFinite(weight_kg) || weight_kg <= 0) {
    return null;
  }

  return { gender, date_of_birth, weight_kg };
}
