import Constants from 'expo-constants';

export type AppVariant = 'staging' | 'production';

export function getAppVariant(): AppVariant {
  const variant = Constants.expoConfig?.extra?.appVariant;
  return variant === 'staging' ? 'staging' : 'production';
}

export function isStaging(): boolean {
  return getAppVariant() === 'staging';
}

export function getAuthContinueUrl(): string {
  const fromConfig = Constants.expoConfig?.extra?.authContinueUrl as string | undefined;
  return fromConfig ?? 'https://www.kale.insure/reset-password';
}

export function getAndroidPackageName(): string {
  return Constants.expoConfig?.android?.package ?? 'insure.kale.mobile';
}

export function getIosBundleId(): string {
  return Constants.expoConfig?.ios?.bundleIdentifier ?? 'insure.kale.mobile';
}
