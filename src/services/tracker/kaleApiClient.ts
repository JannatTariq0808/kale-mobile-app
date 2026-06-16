import { kaleApiUrl } from '../../config/kaleApi';

export async function kaleApiFetch(
  path: string,
  idToken: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(kaleApiUrl(path), {
    ...init,
    headers,
  });
}
