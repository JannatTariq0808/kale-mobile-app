export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  heroImage?: string;
  publishedAtMs: number;
};
