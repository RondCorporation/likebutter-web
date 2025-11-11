'use client';

import React, { useEffect, useState } from 'react';

/**
 * Mobile viewport height 문제를 해결하기 위한 훅
 */
export function useViewportHeight() {
  useEffect(() => {
    const setVh = () => {
      const isZoomed =
        window.visualViewport && window.visualViewport.scale !== 1;
      const vh = isZoomed
        ? window.innerHeight * 0.01
        : (window.visualViewport?.height || window.innerHeight) * 0.01;

      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 초기 설정
    setVh();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVh);
    } else {
      // fallback: window resize
      window.addEventListener('resize', setVh);
    }

    // orientationchange 이벤트도 리스닝
    window.addEventListener('orientationchange', setVh);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVh);
      } else {
        window.removeEventListener('resize', setVh);
      }
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);
}

/**
 * 현재 viewport height를 반환하는 훅
 * 리액트 상태로 관리되므로 컴포넌트가 리렌더링됩니다.
 *
 * Throttle이 적용되어 과도한 리렌더링을 방지합니다.
 */
export function useViewportHeightValue(): number {
  const [height, setHeight] = useState(
    typeof window !== 'undefined'
      ? window.visualViewport?.height || window.innerHeight
      : 0
  );

  useEffect(() => {
    let rafId: number | null = null;
    let lastUpdateTime = 0;
    const THROTTLE_MS = 16; // ~60fps

    const updateHeight = () => {
      // 확대/축소 감지
      const isZoomed =
        window.visualViewport && window.visualViewport.scale !== 1;

      // 확대/축소된 경우 innerHeight를 사용
      const newHeight = isZoomed
        ? window.innerHeight
        : window.visualViewport?.height || window.innerHeight;

      setHeight(newHeight);
    };

    const throttledUpdate = () => {
      const now = Date.now();

      // Cancel any pending update
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Throttle: only update if enough time has passed
      if (now - lastUpdateTime >= THROTTLE_MS) {
        lastUpdateTime = now;
        updateHeight();
      } else {
        // Schedule update for later
        rafId = requestAnimationFrame(() => {
          lastUpdateTime = Date.now();
          updateHeight();
          rafId = null;
        });
      }
    };

    // Initial update
    updateHeight();

    // resize 이벤트에서 확대/축소와 실제 뷰포트 변경을 구분하여 처리
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', throttledUpdate);
    } else {
      window.addEventListener('resize', throttledUpdate);
    }

    window.addEventListener('orientationchange', updateHeight);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', throttledUpdate);
      } else {
        window.removeEventListener('resize', throttledUpdate);
      }
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return height;
}
