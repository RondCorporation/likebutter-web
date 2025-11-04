'use client';

import { ReactNode } from 'react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import BottomSheet from '@/components/BottomSheet';

interface StudioLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  bottomSheetOptions?: {
    initialHeight?: number;
    minHeight?: number;
  };
  mobileBottomButton?: ReactNode;
  hideMobileBottomSheet?: boolean;
  hidePCSidebar?: boolean;
  isBottomSheetOpen?: boolean;
  onBottomSheetToggle?: (isOpen: boolean) => void;
}

export default function StudioLayout({
  sidebar,
  children,
  bottomSheetOptions = {
    initialHeight: 40,
    minHeight: 20,
  },
  mobileBottomButton,
  hideMobileBottomSheet = false,
  hidePCSidebar = false,
  isBottomSheetOpen = false,
  onBottomSheetToggle,
}: StudioLayoutProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="flex items-start h-full w-full bg-studio-main">
        {!hidePCSidebar && (
          <div className="h-full overflow-y-auto flex-shrink-0">{sidebar}</div>
        )}
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-studio-main">
      {/* Scrollable content area - sits behind fixed bottom UI */}
      <div
        className="absolute inset-0 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          // Padding: button height (72px) + bottom sheet initial height (only if not hidden)
          // dvh 사용으로 모바일 주소창 문제 해결
          paddingBottom: hideMobileBottomSheet
            ? mobileBottomButton
              ? '72px'
              : '0'
            : mobileBottomButton
              ? `calc(72px + ${bottomSheetOptions.minHeight}dvh)`
              : `${bottomSheetOptions.minHeight}dvh`,
        }}
      >
        {children}
      </div>

      {/* Unified bottom container - combines BottomSheet and Button to prevent layer crossing */}
      {(!hideMobileBottomSheet || mobileBottomButton) && (
        <div
          className="absolute inset-x-0 bottom-0 z-40"
          style={{
            // Prevent touch events from interfering with scroll
            pointerEvents: 'auto',
          }}
        >
          {/* Bottom sheet - positioned above button, can expand upward */}
          {!hideMobileBottomSheet && (
            <BottomSheet
              initialHeight={bottomSheetOptions.initialHeight}
              minHeight={bottomSheetOptions.minHeight}
              className="bg-studio-sidebar"
              hasBottomButton={!!mobileBottomButton}
              isOpen={isBottomSheetOpen}
              onToggle={onBottomSheetToggle}
            >
              {sidebar}
            </BottomSheet>
          )}

          {/* Bottom button - sits at very bottom, seamlessly connected to bottom sheet */}
          {mobileBottomButton && (
            <div className="relative w-full bg-studio-sidebar">
              <div className="px-3 py-3">{mobileBottomButton}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
