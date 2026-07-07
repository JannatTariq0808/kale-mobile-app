import { deleteField, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, updateProfile } from '../auth';
import { getFirebaseFirestore } from '../auth/firebaseApp';
import { toWeightKg, type WeightUnit } from '../auth/signUp';
import { deleteProfilePhoto, uploadProfilePhoto } from './uploadProfilePhoto';

export type UpdateUserProfileInput = {
  name: string;
  weight: number;
  weightUnit: WeightUnit;
  localPhotoUri?: string | null;
  removePhoto?: boolean;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0]!, lastName: '' };
  return { firstName: parts[0]!, lastName: parts.slice(1).join(' ') };
}

export async function updateUserProfile(uid: string, input: UpdateUserProfileInput): Promise<void> {
  const name = input.name.trim();
  if (!name) {
    throw new Error('Enter your name.');
  }

  const weightKg = toWeightKg(input.weight, input.weightUnit);
  const { firstName, lastName } = splitName(name);
  const authUser = getFirebaseAuth().currentUser;

  let photoUrl: string | null | undefined;
  if (input.removePhoto) {
    await deleteProfilePhoto(uid);
    photoUrl = null;
  } else if (input.localPhotoUri) {
    photoUrl = await uploadProfilePhoto(uid, input.localPhotoUri);
  }

  if (authUser?.uid === uid) {
    await updateProfile(authUser, {
      displayName: name,
      ...(photoUrl !== undefined ? { photoURL: photoUrl } : {}),
    });
  }

  const userPatch: Record<string, unknown> = {
    displayName: name,
    firstName,
    lastName,
    weightKg,
    updatedAt: serverTimestamp(),
  };

  if (photoUrl === null) {
    userPatch.photoUrl = deleteField();
  } else if (typeof photoUrl === 'string') {
    userPatch.photoUrl = photoUrl;
  }

  await updateDoc(doc(getFirebaseFirestore(), 'users', uid), userPatch);
}
