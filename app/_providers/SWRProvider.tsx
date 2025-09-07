'use client';

import { ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { swrConfig } from '@/app/_lib/swrConfig';

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * 전역 SWR Provider
 * 최적화된 캐싱 및 성능 설정 제공
 */
export function SWRProvider({ children }: SWRProviderProps) {
  return <SWRConfig value={swrConfig}>{children}</SWRConfig>;
}
