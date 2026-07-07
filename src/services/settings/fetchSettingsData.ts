import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '../auth/firebaseApp';
import { formatMemberSince } from '../../utils/policyDisplay';

export type SettingsData = {
  displayName: string;
  email: string;
  memberSince: string | null;
  photoUrl: string | null;
  weightKg: number | null;
};

function readDisplayName(
  userData: Record<string, unknown> | undefined,
  authDisplayName: string | null | undefined,
  email: string,
): string {
  const firstName =
    typeof userData?.firstName === 'string'
      ? userData.firstName.trim()
      : typeof userData?.name === 'string'
        ? userData.name.trim().split(/\s+/)[0] ?? ''
        : '';
  const lastName = typeof userData?.lastName === 'string' ? userData.lastName.trim() : '';
  const combined = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (combined) return combined;

  const fromDoc =
    typeof userData?.displayName === 'string' ? userData.displayName.trim() : '';
  if (fromDoc) return fromDoc;

  const fromAuth = authDisplayName?.trim();
  if (fromAuth) return fromAuth;

  const emailPrefix = email.split('@')[0]?.trim();
  return emailPrefix || 'Member';
}

function readPhotoUrl(
  userData: Record<string, unknown> | undefined,
  authPhotoUrl: string | null | undefined,
): string | null {
  const fromDoc =
    typeof userData?.photoUrl === 'string'
      ? userData.photoUrl.trim()
      : typeof userData?.photoURL === 'string'
        ? userData.photoURL.trim()
        : '';
  if (fromDoc) return fromDoc;

  const fromAuth = authPhotoUrl?.trim();
  return fromAuth || null;
}

function readWeightKg(userData: Record<string, unknown> | undefined): number | null {
  const raw = userData?.weightKg ?? userData?.weight_kg ?? userData?.weight_in_kg;
  const parsed =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return Math.round(parsed * 100) / 100;
}

export async function fetchSettingsData(uid: string): Promise<SettingsData> {
  const authUser = getFirebaseAuth().currentUser;
  const email = authUser?.email?.trim() || '';

  const userSnap = await getDoc(doc(getFirebaseFirestore(), 'users', uid));
  const userData = userSnap.exists() ? (userSnap.data() as Record<string, unknown>) : undefined;

  return {
    displayName: readDisplayName(userData, authUser?.displayName, email),
    email: email || (typeof userData?.email === 'string' ? userData.email : ''),
    memberSince:
      formatMemberSince(userData?.createdAt) ??
      formatMemberSince(authUser?.metadata?.creationTime ?? null),
    photoUrl: readPhotoUrl(userData, authUser?.photoURL),
    weightKg: readWeightKg(userData),
  };
}
