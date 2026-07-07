import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage } from '../auth/firebaseApp';

/** Image bytes in Storage; download URL is saved on `users/{uid}.photoUrl`. */
const PROFILE_PHOTO_PATH = (uid: string) => `users/${uid}/avatar.jpg`;

async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Could not read the selected photo.');
  }
  return response.blob();
}

async function prepareProfileImage(uri: string): Promise<Blob> {
  const resized = await manipulateAsync(
    uri,
    [{ resize: { width: 512, height: 512 } }],
    { compress: 0.85, format: SaveFormat.JPEG },
  );
  return uriToBlob(resized.uri);
}

export async function uploadProfilePhoto(uid: string, localUri: string): Promise<string> {
  const blob = await prepareProfileImage(localUri);
  const storageRef = ref(getFirebaseStorage(), PROFILE_PHOTO_PATH(uid));
  await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(storageRef);
}

export async function deleteProfilePhoto(uid: string): Promise<void> {
  try {
    await deleteObject(ref(getFirebaseStorage(), PROFILE_PHOTO_PATH(uid)));
  } catch (error) {
    const code =
      typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    if (code !== 'storage/object-not-found') {
      throw error;
    }
  }
}
