'use client';

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useViewportHeightValue } from '@/app/_hooks/useViewportHeight';

interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number;
  minHeight?: number;
  className?: string;
  hasBottomButton?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function BottomSheet({
  children,
  initialHeight = 40,
  minHeight = 20,
  className = '',
  hasBottomButton = false,
  isOpen = false,
  onToggle,
}: BottomSheetProps) {
  const isMobile = useIsMobile();
  const viewportHeight = useViewportHeightValue();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const initialRenderRef = useRef(true);

  // Only apply scroll lock on mobile when the bottom sheet is open
  useScrollLock(isMobile && isOpen);

  // Mark as not initial render after mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure this happens after paint
    const rafId = requestAnimationFrame(() => {
      initialRenderRef.current = false;
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Touch event handlers - must be before early return to maintain hook order
  const handleToolbarClick = useCallback(() => {
    setHasInteracted(true);
    onToggle?.(!isOpen);
  }, [isOpen, onToggle]);

  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

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

  // On initial render, always start with minHeight to prevent flash
  const targetHeight = initialRenderRef.current
    ? minHeight
    : isOpen
      ? initialHeight
      : minHeight;
  // visualViewport 기반의 정확한 높이 계산
  const actualHeight = Math.min((targetHeight / 100) * viewportHeight, 500);

  // Bottom offset calculation:
  // - With button: relative positioning (stacked above button in unified container)
  // - Without button: absolute at bottom
  const positionClass = hasBottomButton ? 'relative' : 'absolute';
  const bottomClass = hasBottomButton ? '' : 'bottom-0';

  // Only apply transition after user has interacted or after initial render
  const shouldTransition = !initialRenderRef.current || hasInteracted;

  return (
    <div
      ref={sheetRef}
      className={`${positionClass} inset-x-0 ${bottomClass} bg-studio-sidebar border-t border-studio-border rounded-t-xl shadow-xl flex flex-col ${shouldTransition && !isTouching ? 'transition-all duration-300 ease-out' : ''} ${className}`}
      style={{
        height: `${actualHeight}px`,
        maxHeight: '500px',
        // Remove z-index as it's now controlled by parent unified container
        // Disable transitions during touch to prevent layout shift visibility
        willChange: isTouching ? 'height' : 'auto',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Toolbar - Click to toggle */}
      <div
        className="flex justify-center py-3 cursor-pointer select-none shrink-0"
        onClick={handleToolbarClick}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        <div
          className={`w-12 h-1 bg-studio-text-muted rounded-full transition-all duration-200 ${
            isOpen ? 'bg-studio-button-primary scale-110' : ''
          }`}
        />
      </div>

      {/* Scrollable content area */}
      <div
        className="flex-1 overflow-y-auto px-3 overscroll-contain"
        style={{
          touchAction: 'pan-y',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          paddingBottom: hasBottomButton
            ? 'calc(0.75rem + 20px)'
            : 'calc(0.75rem + 20px)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
