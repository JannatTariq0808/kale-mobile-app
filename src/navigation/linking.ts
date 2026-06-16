import * as Linking from 'expo-linking';

export type PasswordResetLink = {
  oobCode: string;
};

function queryParam(
  params: Linking.QueryParams | null | undefined,
  key: string,
): string | undefined {
  const value = params?.[key];
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value[0];
  return undefined;
}

/** Parse Firebase password-reset links (custom domain or firebaseapp.com). */
export function parsePasswordResetLink(url: string): PasswordResetLink | null {
  const { queryParams } = Linking.parse(url);
  const mode = queryParam(queryParams, 'mode');
  const oobCode = queryParam(queryParams, 'oobCode');

  if (mode === 'resetPassword' && oobCode) {
    return { oobCode };
  }

  return null;
}

/** Universal links + custom scheme only — do not include Linking.createURL('/') (matches Expo Go exp:// URLs and forces Welcome). */
export const AUTH_LINK_PREFIXES = [
  'kale://',
  'https://www.kale.insure',
  'https://kale.insure',
];
