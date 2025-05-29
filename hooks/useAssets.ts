'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAssets() {
  return useSWR<string[]>('/api/assets', fetcher);
}
