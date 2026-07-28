import { useCallback, useEffect, useState } from 'react';
import { fetchArticles } from '../services/articles/fetchArticles';
import type { Article } from '../types/article';

export type ArticlesState = {
  articles: Article[];
  loading: boolean;
};

const EMPTY: ArticlesState = {
  articles: [],
  loading: true,
};

let articlesCache: Article[] | null = null;
let inflight: Promise<Article[]> | null = null;
type Listener = (state: ArticlesState) => void;
const listeners = new Set<Listener>();
let latestState: ArticlesState = EMPTY;

function publish(state: ArticlesState): void {
  latestState = state;
  listeners.forEach((listener) => listener(state));
}

async function loadArticles(): Promise<Article[]> {
  if (articlesCache) return articlesCache;

  publish({ articles: [], loading: true });
  const articles = await fetchArticles();
  articlesCache = articles;
  publish({ articles, loading: false });
  return articles;
}

function startLoad(): void {
  if (articlesCache || inflight) return;
  inflight = loadArticles().finally(() => {
    inflight = null;
  });
}

export function invalidateArticlesCache(): void {
  articlesCache = null;
}

export function prefetchArticles(): void {
  startLoad();
}

export function useArticles(): ArticlesState & { refresh: () => void } {
  const [state, setState] = useState<ArticlesState>(() =>
    articlesCache ? { articles: articlesCache, loading: false } : latestState,
  );

  useEffect(() => {
    const listener: Listener = (next) => setState(next);
    listeners.add(listener);

    if (articlesCache) {
      listener({ articles: articlesCache, loading: false });
    } else {
      listener(latestState);
      startLoad();
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const refresh = useCallback(() => {
    articlesCache = null;
    void loadArticles();
  }, []);

  return { ...state, refresh };
}
