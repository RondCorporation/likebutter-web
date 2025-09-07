'use client';

import { SWRConfiguration } from 'swr';

/**
 * 전역 SWR 설정
 * 최적화된 캐싱 및 재검증 설정
 */
export const swrConfig: SWRConfiguration = {
  // 캐싱 전략
  revalidateOnFocus: false, // 포커스 시 재검증 비활성화 (성능 최적화)
  revalidateOnReconnect: true, // 재연결 시 재검증 활성화 (데이터 일관성)
  revalidateIfStale: true, // stale 데이터 재검증

  // 중복 제거 및 캐싱
  dedupingInterval: 60000, // 1분간 중복 요청 제거
  focusThrottleInterval: 5000, // 포커스 이벤트 throttle

  // 에러 처리
  errorRetryCount: 2, // 최대 2회 재시도
  errorRetryInterval: 5000, // 5초 간격으로 재시도
  shouldRetryOnError: (error) => {
    // 4xx 클라이언트 에러는 재시도하지 않음
    if (error?.status >= 400 && error?.status < 500) {
      return false;
    }
    return true;
  },

  // 성능 최적화
  keepPreviousData: true, // 새 데이터 로딩 중에도 이전 데이터 유지

  // 로딩 상태 최적화
  loadingTimeout: 3000, // 3초 후 로딩 타임아웃

  // 캐시 크기 제한은 기본 provider 사용
  // provider: () => new Map(), // 기본 Map 사용

  // 전역 에러 핸들러
  onError: (error, key) => {
    if (error.status !== 403 && error.status !== 404) {
      console.warn('SWR Error:', { key, error: error.message });
    }
  },

  // 성공 시 로깅 (개발 환경에서만)
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
  // 사용자 데이터 (중요하므로 자주 갱신)
  user: {
    ...swrConfig,
    dedupingInterval: 30000, // 30초
    revalidateOnFocus: true, // 포커스 시 재검증
  },

  // Task 데이터 (실시간성 중요)
  tasks: {
    ...swrConfig,
    refreshInterval: 10000, // 10초마다 자동 갱신
    dedupingInterval: 5000, // 5초 중복 제거
  },

  // 구독 정보 (변경 빈도 낮음)
  subscription: {
    ...swrConfig,
    dedupingInterval: 300000, // 5분
    revalidateOnMount: false, // 마운트 시 재검증 비활성화
  },

  // Plans 정보 (정적 데이터)
  plans: {
    ...swrConfig,
    dedupingInterval: 3600000, // 1시간
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
