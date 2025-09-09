'use client';

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
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
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastClientY, setLastClientY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientY = e.touches[0].clientY;
    setStartY(clientY);
    setLastClientY(clientY);
    setStartHeight(height);
    setVelocity(0);
    setLastMoveTime(Date.now());
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [height]);

  const handleMouseStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setLastClientY(e.clientY);
    setStartHeight(height);
    setVelocity(0);
    setLastMoveTime(Date.now());
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [height]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;

    const now = Date.now();
    const timeDelta = now - lastMoveTime;
    
    if (timeDelta > 0) {
      const clientYDelta = clientY - lastClientY;
      setVelocity(clientYDelta / timeDelta);
      setLastClientY(clientY);
      setLastMoveTime(now);
    }

    const deltaY = startY - clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaPercent));
    
    setHeight(newHeight);
  }, [isDragging, startY, startHeight, lastMoveTime, lastClientY, minHeight, maxHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientY);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientY);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    
    // 관성 기반 최종 위치 계산
    const momentum = velocity * -200; // 관성 효과 강화
    let finalHeight = height + momentum;
    
    // 스냅 포인트 결정
    const snapPoints = [minHeight, initialHeight, maxHeight];
    let targetHeight = finalHeight;
    
    // 가장 가까운 스냅 포인트 찾기
    let minDistance = Infinity;
    snapPoints.forEach(point => {
      const distance = Math.abs(finalHeight - point);
      if (distance < minDistance) {
        minDistance = distance;
        targetHeight = point;
      }
    });
    
    // 속도가 빠르면 더 먼 스냅 포인트로 이동
    if (Math.abs(velocity) > 0.5) {
      if (velocity > 0 && targetHeight < maxHeight) {
        targetHeight = maxHeight;
      } else if (velocity < 0 && targetHeight > minHeight) {
        targetHeight = minHeight;
      }
    }
    
    // 경계값 적용
    targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));
    
    // 부드러운 애니메이션으로 최종 위치로 이동
    animateToHeight(targetHeight);
  }, [height, velocity, minHeight, maxHeight, initialHeight]);

  // 애니메이션 함수
  const animateToHeight = useCallback((targetHeight: number) => {
    const startHeight = height;
    const startTime = Date.now();
    const duration = 300; // 300ms 애니메이션
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutCubic 이징 함수 적용
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentHeight = startHeight + (targetHeight - startHeight) * easeProgress;
      
      setHeight(currentHeight);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  }, [height]);

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
  }, [isDragging, handleMouseMove, handleEnd]);
  
  // 컴포넌트 언마운트 시 애니메이션 정리
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
      className={`fixed inset-x-0 bottom-0 z-50 bg-studio-sidebar border-t border-studio-border rounded-t-xl shadow-xl ${isDragging ? '' : 'transition-transform duration-200 ease-out'} ${className}`}
      style={{
        height: `${height}vh`,
        transform: isDragging ? 'translateZ(0)' : undefined,
        willChange: isDragging ? 'transform' : 'auto',
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseStart}
        style={{ touchAction: 'none' }}
      >
        <div className={`w-12 h-1 bg-studio-text-muted rounded-full transition-all duration-200 ${
          isDragging ? 'bg-studio-button-primary scale-110' : ''
        }`} />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-3 overscroll-contain">
        {children}
      </div>
    </div>
  );
}