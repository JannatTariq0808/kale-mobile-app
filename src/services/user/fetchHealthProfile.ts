import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
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

/** What the cardio assessment still needs from the member before it can run. */
export type MissingHealthField = 'weight' | 'gender' | 'dateOfBirth';

export async function fetchMissingHealthFields(): Promise<MissingHealthField[]> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return [];
  const snap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  const data = (snap.exists() ? snap.data() : {}) as Record<string, unknown>;
  const missing: MissingHealthField[] = [];
  if (readWeightKg(data) == null) missing.push('weight');
  if (!normalizeGender(data.gender)) missing.push('gender');
  if (!formatDateOfBirth(data.dateOfBirth) && !formatDateOfBirth(data.date_of_birth)) {
    missing.push('dateOfBirth');
  }
  return missing;
}

export type HealthFieldsInput = {
  weightKg?: number;
  gender?: 'Female' | 'Male';
  dateOfBirth?: Date;
};

/** Saves only the fields given (same shapes the website writes). */
export async function saveHealthFields(input: HealthFieldsInput): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('You must be signed in.');
  const patch: Record<string, unknown> = {};
  if (input.weightKg != null) patch.weightKg = Math.round(input.weightKg * 10) / 10;
  if (input.gender) patch.gender = input.gender;
  if (input.dateOfBirth) {
    const d = input.dateOfBirth;
    patch.dateOfBirth = Timestamp.fromDate(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())));
  }
  if (Object.keys(patch).length === 0) return;
  patch.updatedAt = serverTimestamp();
  await setDoc(doc(getFirebaseFirestore(), 'users', uid), patch, { merge: true });
}
