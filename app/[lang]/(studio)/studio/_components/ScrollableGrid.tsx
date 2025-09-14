'use client';

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableGridProps {
  children: ReactNode;
  rows: 1 | 2;
  scrollAmount?: number;
  className?: string;
}

export default function ScrollableGrid({
  children,
  rows,
  scrollAmount = 200,
  className = ""
}: ScrollableGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [canScrollLeft, scrollAmount]);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  }, [canScrollRight, scrollAmount]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [checkScrollButtons]);

  // 화살표 위치 계산
  const arrowPositionClass = rows === 1
    ? "top-8 transform -translate-y-1/2"  // 1줄: 아이콘 중심 (32px, 텍스트 제외)
    : "top-1/2 transform -translate-y-1/2"; // 2줄: 전체 중앙

  return (
    <div className={`relative w-full overflow-hidden group ${className}`}>
      {/* 스크롤 컨테이너 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-webkit-scrollbar-width:none] [scrollbar-width:none] overscroll-contain"
        onScroll={checkScrollButtons}
      >
        {children}
      </div>

      {/* 페이드 효과 */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
      )}

      {canScrollRight && (
        <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
      )}

      {/* 스크롤 화살표 - 동적 위치 */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className={`absolute left-1 ${arrowPositionClass} p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20`}
        >
          <ChevronLeft className="w-3 h-3 text-studio-text-primary" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className={`absolute right-1 ${arrowPositionClass} p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20`}
        >
          <ChevronRight className="w-3 h-3 text-studio-text-primary" />
        </button>
      )}
    </div>
  );
}