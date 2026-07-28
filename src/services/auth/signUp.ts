import {
  createUserWithEmailAndPassword,
  getFirebaseAuth,
  updateProfile,
} from './index';
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebaseApp';
import { defaultNotificationPreferencesField } from '../settings/notificationPreferences';

export type UserGender = 'female' | 'male';
export type WeightUnit = 'kg' | 'lbs';

export type SignUpProfileInput = {
  email: string;
  password: string;
  name: string;
  gender: UserGender;
  dateOfBirth: Date;
  weight: number;
  weightUnit: WeightUnit;
};

const LBS_TO_KG = 0.45359237;

/** Midnight local time — stored as Firestore Timestamp for age calculations. */
function toDobTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

/** Always persist kg — convert lbs at save time for downstream calculations. */
export function toWeightKg(weight: number, unit: WeightUnit): number {
  const kg = unit === 'kg' ? weight : weight * LBS_TO_KG;
  return Math.round(kg * 100) / 100;
}

export async function signUpWithProfile(input: SignUpProfileInput) {
  const email = input.email.trim();
  const name = input.name.trim();

  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, input.password);

  await updateProfile(credential.user, { displayName: name });

  try {
    await setDoc(doc(getFirebaseFirestore(), 'users', credential.user.uid), {
      email: email.toLowerCase(),
      displayName: name,
      gender: input.gender,
      dateOfBirth: toDobTimestamp(input.dateOfBirth),
      weightKg: toWeightKg(input.weight, input.weightUnit),
      ...defaultNotificationPreferencesField(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code === 'permission-denied' || code === 'unavailable') {
      throw error;
    }
    throw new Error('Account created but profile could not be saved. Try logging in again.');
  }

  return credential;
}
