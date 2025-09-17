'use client';

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number; // 초기 높이 (%)
  maxHeight?: number; // 최대 높이 (%)
  minHeight?: number; // 최소 높이 (%)
  className?: string;
  bottomButton?: ReactNode; // 하단 고정 버튼
}

export default function BottomSheet({
  children,
  initialHeight = 40,
  maxHeight = 85,
  minHeight = 20,
  className = '',
  bottomButton,
}: BottomSheetProps) {
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(initialHeight);
  const [velocity, setVelocity] = useState(0);
  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [lastClientY, setLastClientY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // cancelable인 경우에만 preventDefault 호출
    if (e.nativeEvent.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();
    setIsDragging(true);
    setIsAnimating(false);
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
    e.stopPropagation();
    setIsDragging(true);
    setIsAnimating(false);
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
    if (!isDragging || isAnimating) return;

    const now = Date.now();
    const timeDelta = now - lastMoveTime;

    if (timeDelta > 0) {
      const clientYDelta = clientY - lastClientY;
      // 속도 계산을 더 정밀하게
      const newVelocity = timeDelta > 16 ? clientYDelta / timeDelta : velocity;
      setVelocity(newVelocity * 0.8 + velocity * 0.2); // 스무싱 적용
      setLastClientY(clientY);
      setLastMoveTime(now);
    }

    const deltaY = startY - clientY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    let newHeight = startHeight + deltaPercent;

    // 경계 밖으로 나갈 때 저항 효과 추가
    if (newHeight > maxHeight) {
      const overshoot = newHeight - maxHeight;
      newHeight = maxHeight + overshoot * 0.3; // 30% 저항
    } else if (newHeight < minHeight) {
      const undershoot = minHeight - newHeight;
      newHeight = minHeight - undershoot * 0.3; // 30% 저항
    }

    setHeight(newHeight);
  }, [isDragging, isAnimating, startY, startHeight, lastMoveTime, lastClientY, velocity, minHeight, maxHeight]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // cancelable인 경우에만 preventDefault 호출
    if (e.nativeEvent.cancelable) {
      e.preventDefault();
    }
    handleMove(e.touches[0].clientY);
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientY);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);

    // 현재 높이가 경계를 벗어났으면 즉시 수정
    let currentHeight = height;
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    } else if (currentHeight < minHeight) {
      currentHeight = minHeight;
    }

    // 관성 기반 최종 위치 계산 (더 자연스러운 계수 적용)
    const momentum = velocity * -300; // 관성 효과 조정
    let finalHeight = currentHeight + momentum;

    // 스냅 포인트 결정
    const snapPoints = [minHeight, initialHeight, maxHeight];
    let targetHeight = finalHeight;

    // 속도 임계값 조정 및 개선된 스냅 로직
    const velocityThreshold = 0.3;
    if (Math.abs(velocity) > velocityThreshold) {
      // 속도 방향에 따른 스냅 포인트 선택
      if (velocity > 0) {
        // 위로 스와이프 - 더 높은 위치로
        const higherPoints = snapPoints.filter(point => point > currentHeight);
        if (higherPoints.length > 0) {
          targetHeight = Math.min(...higherPoints);
        } else {
          targetHeight = maxHeight;
        }
      } else {
        // 아래로 스와이프 - 더 낮은 위치로
        const lowerPoints = snapPoints.filter(point => point < currentHeight);
        if (lowerPoints.length > 0) {
          targetHeight = Math.max(...lowerPoints);
        } else {
          targetHeight = minHeight;
        }
      }
    } else {
      // 속도가 느리면 가장 가까운 스냅 포인트로
      let minDistance = Infinity;
      snapPoints.forEach(point => {
        const distance = Math.abs(currentHeight - point);
        if (distance < minDistance) {
          minDistance = distance;
          targetHeight = point;
        }
      });
    }

    // 경계값 적용
    targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));

    // 부드러운 애니메이션으로 최종 위치로 이동
    animateToHeight(targetHeight);
  }, [height, velocity, minHeight, maxHeight, initialHeight]);

  // 개선된 애니메이션 함수
  const animateToHeight = useCallback((targetHeight: number) => {
    const startHeight = height;
    const startTime = Date.now();
    const distance = Math.abs(targetHeight - startHeight);
    // 거리에 따라 애니메이션 시간 조정 (최소 200ms, 최대 400ms)
    const duration = Math.max(200, Math.min(400, distance * 8));

    setIsAnimating(true);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuart 이징 함수로 더 자연스러운 움직임
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentHeight = startHeight + (targetHeight - startHeight) * easeProgress;

      setHeight(currentHeight);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setVelocity(0);
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
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleMouseStart}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      >
        <div className={`w-12 h-1 bg-studio-text-muted rounded-full transition-all duration-200 ${
          isDragging ? 'bg-studio-button-primary scale-110' : ''
        }`} />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className="flex-1 overflow-y-auto px-3 overscroll-contain"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
          onTouchStart={(e) => {
            // 콘텐츠 영역에서의 터치는 버블링을 방지
            e.stopPropagation();
          }}
        >
          {children}
        </div>

        {/* 하단 고정 버튼 영역 */}
        {bottomButton && (
          <div className="px-3 py-3 border-t border-studio-border bg-studio-sidebar">
            {bottomButton}
          </div>
        )}
      </div>
    </div>
  );
}