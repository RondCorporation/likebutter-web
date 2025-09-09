'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number; // 초기 높이 (%)
  maxHeight?: number; // 최대 높이 (%)
  minHeight?: number; // 최소 높이 (%)
  className?: string;
}

export default function BottomSheet({
  children,
  initialHeight = 40,
  maxHeight = 85,
  minHeight = 20,
  className = '',
}: BottomSheetProps) {
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(initialHeight);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartHeight(height);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(height);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = startY - clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaPercent));
    
    setHeight(newHeight);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    
    // 스냅 기능: 특정 높이에 가까우면 자동으로 스냅
    if (height < minHeight + 5) {
      setHeight(minHeight);
    } else if (height > maxHeight - 5) {
      setHeight(maxHeight);
    } else if (Math.abs(height - initialHeight) < 10) {
      setHeight(initialHeight);
    }
  };

  // 마우스 이벤트 리스너
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
      };
    }
  }, [isDragging, startY, startHeight]);

  // 데스크톱에서는 일반 사이드바로 표시
  if (!isMobile) {
    return (
      <div className={`flex flex-col w-[260px] h-full ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={sheetRef}
      className={`fixed inset-x-0 bottom-0 z-50 bg-studio-sidebar border-t border-studio-border rounded-t-xl shadow-xl transition-all duration-300 ease-out ${className}`}
      style={{
        height: `${height}vh`,
        transform: isDragging ? 'none' : undefined,
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseStart}
      >
        <div className="w-12 h-1 bg-studio-text-muted rounded-full" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-3">
        {children}
      </div>
    </div>
  );
}