'use client';

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number;
  maxHeight?: number;
  minHeight?: number;
  className?: string;
  bottomButton?: ReactNode;
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

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
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
    },
    [height]
  );

  const handleMouseStart = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [height]
  );

  const handleMove = useCallback(
    (clientY: number) => {
      if (!isDragging || isAnimating) return;

      const now = Date.now();
      const timeDelta = now - lastMoveTime;

      if (timeDelta > 0) {
        const clientYDelta = clientY - lastClientY;

        const newVelocity =
          timeDelta > 16 ? clientYDelta / timeDelta : velocity;
        setVelocity(newVelocity * 0.8 + velocity * 0.2);
        setLastClientY(clientY);
        setLastMoveTime(now);
      }

      const deltaY = startY - clientY;
      const viewportHeight = window.innerHeight;
      const deltaPercent = (deltaY / viewportHeight) * 100;
      let newHeight = startHeight + deltaPercent;

      if (newHeight > maxHeight) {
        const overshoot = newHeight - maxHeight;
        newHeight = maxHeight + overshoot * 0.3;
      } else if (newHeight < minHeight) {
        const undershoot = minHeight - newHeight;
        newHeight = minHeight - undershoot * 0.3;
      }

      setHeight(newHeight);
    },
    [
      isDragging,
      isAnimating,
      startY,
      startHeight,
      lastMoveTime,
      lastClientY,
      velocity,
      minHeight,
      maxHeight,
    ]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.nativeEvent.cancelable) {
        e.preventDefault();
      }
      handleMove(e.touches[0].clientY);
    },
    [handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientY);
    },
    [handleMove]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);

    let currentHeight = height;
    if (currentHeight > maxHeight) {
      currentHeight = maxHeight;
    } else if (currentHeight < minHeight) {
      currentHeight = minHeight;
    }

    const momentum = velocity * -300;
    let finalHeight = currentHeight + momentum;

    const snapPoints = [minHeight, initialHeight, maxHeight];
    let targetHeight = finalHeight;

    const velocityThreshold = 0.3;
    if (Math.abs(velocity) > velocityThreshold) {
      if (velocity > 0) {
        const higherPoints = snapPoints.filter(
          (point) => point > currentHeight
        );
        if (higherPoints.length > 0) {
          targetHeight = Math.min(...higherPoints);
        } else {
          targetHeight = maxHeight;
        }
      } else {
        const lowerPoints = snapPoints.filter((point) => point < currentHeight);
        if (lowerPoints.length > 0) {
          targetHeight = Math.max(...lowerPoints);
        } else {
          targetHeight = minHeight;
        }
      }
    } else {
      let minDistance = Infinity;
      snapPoints.forEach((point) => {
        const distance = Math.abs(currentHeight - point);
        if (distance < minDistance) {
          minDistance = distance;
          targetHeight = point;
        }
      });
    }

    targetHeight = Math.max(minHeight, Math.min(maxHeight, targetHeight));

    animateToHeight(targetHeight);
  }, [height, velocity, minHeight, maxHeight, initialHeight]);

  const animateToHeight = useCallback(
    (targetHeight: number) => {
      const startHeight = height;
      const startTime = Date.now();
      const distance = Math.abs(targetHeight - startHeight);

      const duration = Math.max(200, Math.min(400, distance * 8));

      setIsAnimating(true);

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentHeight =
          startHeight + (targetHeight - startHeight) * easeProgress;

        setHeight(currentHeight);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          setVelocity(0);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    [height]
  );

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

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
      {/* Drag handle */}
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
          WebkitTouchCallout: 'none',
        }}
      >
        <div
          className={`w-12 h-1 bg-studio-text-muted rounded-full transition-all duration-200 ${
            isDragging ? 'bg-studio-button-primary scale-110' : ''
          }`}
        />
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1 min-h-0">
        <div
          className="flex-1 overflow-y-auto px-3 overscroll-contain"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>

        {/* Fixed bottom button area */}
        {bottomButton && (
          <div className="px-3 py-3 border-t border-studio-border bg-studio-sidebar">
            {bottomButton}
          </div>
        )}
      </div>
    </div>
  );
}
