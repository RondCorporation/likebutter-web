'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // 초기 상태 설정
    setMatches(media.matches);
    
    // 상태 변경 리스너
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 새로운 addEventListener 방식 사용
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// 미리 정의된 브레이크포인트 훅들
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');  
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');