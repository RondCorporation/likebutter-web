'use client';

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';

interface BottomSheetProps {
  children: ReactNode;
  initialHeight?: number;
  maxHeight?: number;
  minHeight?: number;
  className?: string;
  hasBottomButton?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export default function BottomSheet({
  children,
  initialHeight = 40,
  maxHeight = 85,
  minHeight = 20,
  className = '',
  hasBottomButton = false,
  isOpen = false,
  onToggle,
}: BottomSheetProps) {
  const isMobile = useIsMobile();
  const [isAnimating, setIsAnimating] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  // Only apply scroll lock on mobile when the bottom sheet is open
  useScrollLock(isMobile && isOpen);

  const handleToolbarClick = useCallback(() => {
    onToggle?.(!isOpen);
  }, [isOpen, onToggle]);

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

  const targetHeight = isOpen ? initialHeight : minHeight;
  const actualHeight = Math.min((targetHeight / 100) * window.innerHeight, 500);

  // Bottom offset calculation:
  // - With button: 88px (navigation) + 72px (button: 12+48+12) = 160px
  // - Without button: 88px (navigation only)
  const bottomOffset = hasBottomButton ? 'bottom-[160px]' : 'bottom-[88px]';

  return (
    <div
      ref={sheetRef}
      className={`fixed inset-x-0 ${bottomOffset} bg-studio-sidebar border-t border-studio-border rounded-t-xl shadow-xl flex flex-col transition-all duration-300 ease-out ${className}`}
      style={{
        height: `${actualHeight}px`,
        maxHeight: '500px',
        zIndex: 45,
      }}
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
