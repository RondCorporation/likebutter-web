'use client';

import { SWRConfiguration } from 'swr';

/**
 * 전역 SWR 설정
 * 최적화된 캐싱 및 재검증 설정
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  revalidateIfStale: true,

  dedupingInterval: 60000,
  focusThrottleInterval: 5000,

  errorRetryCount: 2,
  errorRetryInterval: 5000,
  shouldRetryOnError: (error) => {
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    return true;
  },

  keepPreviousData: true,

  loadingTimeout: 3000,

  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      console.warn('SWR Error:', { key, error: error.message });
    }
  },

  onSuccess: (data, key, config) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('SWR Success:', {
        key,
        dataSize: JSON.stringify(data).length,
      });
    }
  },
};

/**
 * API별 특화 설정
 */
export const swrConfigs = {
  user: {
    ...swrConfig,
    dedupingInterval: 30000,
    revalidateOnFocus: true,
  },

  tasks: {
    ...swrConfig,
    refreshInterval: 10000,
    dedupingInterval: 5000,
  },

  subscription: {
    ...swrConfig,
    dedupingInterval: 300000,
    revalidateOnMount: false,
  },

  plans: {
    ...swrConfig,
    dedupingInterval: 3600000,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
  },
};

/**
 * 조건부 SWR 키 생성 헬퍼
 */
export function createConditionalKey(
  baseKey: string,
  condition: boolean,
  params?: Record<string, any>
): string | null {
  if (!condition) return null;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    return `${baseKey}?${searchParams.toString()}`;
  }

  return baseKey;
}
