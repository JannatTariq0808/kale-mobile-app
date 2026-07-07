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

function readWeightKg(data: Record<string, unknown>): number | undefined {
  const raw = data.weightKg ?? data.weight_kg ?? data.weight_in_kg;
  const weight_kg =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
  if (!Number.isFinite(weight_kg) || weight_kg <= 0) return undefined;
  return weight_kg;
}

/** Gender + DOB for strength / cohort grading (weight optional). */
export type DemographicsForAssess = {
  gender: string;
  date_of_birth: string;
  weight_kg?: number;
};

export async function fetchDemographicsForAssess(): Promise<DemographicsForAssess | null> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return null;

  const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  if (!snap.exists()) return null;

  const data = snap.data() as Record<string, unknown>;
  const gender = normalizeGender(data.gender);
  const date_of_birth =
    formatDateOfBirth(data.dateOfBirth) ?? formatDateOfBirth(data.date_of_birth);

  if (!gender || !date_of_birth) return null;

  return {
    gender,
    date_of_birth,
    weight_kg: readWeightKg(data),
  };
}

export async function fetchHealthProfileForAssess(): Promise<HealthProfileForAssess | null> {
  const demographics = await fetchDemographicsForAssess();
  if (!demographics?.weight_kg) return null;

  return {
    gender: demographics.gender,
    date_of_birth: demographics.date_of_birth,
    weight_kg: demographics.weight_kg,
  };
}
