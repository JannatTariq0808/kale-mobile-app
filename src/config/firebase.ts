import Constants from 'expo-constants';

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function getFirebaseConfig(): FirebaseConfig {
  const raw = Constants.expoConfig?.extra?.firebase as Partial<FirebaseConfig> | undefined;

  const config: FirebaseConfig = {
    apiKey: raw?.apiKey ?? '',
    authDomain: raw?.authDomain ?? '',
    projectId: raw?.projectId ?? '',
    storageBucket: raw?.storageBucket ?? '',
    messagingSenderId: raw?.messagingSenderId ?? '',
    appId: raw?.appId ?? '',
  };

  return config;
}

export function isFirebaseConfigured(): boolean {
  const { apiKey, projectId, appId } = getFirebaseConfig();
  return Boolean(apiKey && projectId && appId);
}

export function getFirebaseProjectId(): string {
  return getFirebaseConfig().projectId;
}
