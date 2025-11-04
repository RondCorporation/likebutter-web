'use client';

import React, { useEffect, useState } from 'react';

/**
 * Mobile viewport height 문제를 해결하기 위한 훅
 *
 * 모바일 브라우저의 주소창이 나타나거나 사라질 때
 * viewport height가 변경되는 문제를 해결합니다.
 *
 * CSS 변수 --vh를 설정하여 실제 viewport height의 1%를 저장하고,
 * CSS에서 calc(var(--vh, 1vh) * 100) 형태로 사용할 수 있습니다.
 */
export function useViewportHeight() {
  useEffect(() => {
    // 실제 viewport height 계산 및 CSS 변수 설정
    const setVh = () => {
      // visualViewport API 사용 (모던 브라우저)
      const vh = window.visualViewport
        ? window.visualViewport.height * 0.01
        : window.innerHeight * 0.01;

      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // 초기 설정
    setVh();

    // visualViewport API가 있으면 사용 (더 정확함)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', setVh);
      window.visualViewport.addEventListener('scroll', setVh);
    } else {
      // fallback: window resize
      window.addEventListener('resize', setVh);
    }

    // orientationchange 이벤트도 리스닝 (화면 회전 시)
    window.addEventListener('orientationchange', setVh);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', setVh);
        window.visualViewport.removeEventListener('scroll', setVh);
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
      const newHeight = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;
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

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', throttledUpdate);
      window.visualViewport.addEventListener('scroll', throttledUpdate);
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
        window.visualViewport.removeEventListener('scroll', throttledUpdate);
      } else {
        window.removeEventListener('resize', throttledUpdate);
      }
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  return height;
}
