import { kaleApiUrl } from '../config/kaleApi';

export function articleBlogUrl(slug: string): string {
  const trimmed = slug.trim().replace(/^\/+|\/+$/g, '');
  return kaleApiUrl(`/blog/${trimmed}`);
}
