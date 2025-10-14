'use client';

import { ReactNode } from 'react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import BottomSheet from '@/components/BottomSheet';

interface StudioLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  bottomSheetOptions?: {
    initialHeight?: number;
    maxHeight?: number;
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
    maxHeight: 85,
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
      {/* Main content area */}
      <div
        className="h-full overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          // Padding for navigation only (button is fixed and doesn't affect scroll area)
          paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </div>

      {/* Bottom sheet - positioned above button (z-45)
          Can expand/collapse over the content area
      */}
      {!hideMobileBottomSheet && (
        <BottomSheet
          initialHeight={bottomSheetOptions.initialHeight}
          maxHeight={bottomSheetOptions.maxHeight}
          minHeight={bottomSheetOptions.minHeight}
          className="bg-studio-sidebar"
          hasBottomButton={!!mobileBottomButton}
          isOpen={isBottomSheetOpen}
          onToggle={onBottomSheetToggle}
        >
          {sidebar}
        </BottomSheet>
      )}

      {/* Fixed bottom button - above navigation (z-40)
          Position: directly above MobileBottomNavigation
          MobileBottomNavigation: z-50, height ~88px + safe-area-inset-bottom
      */}
      {mobileBottomButton && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 bg-studio-sidebar border-t border-studio-border"
          style={{
            paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
          }}
        >
          <div className="px-3 pt-3 pb-3">{mobileBottomButton}</div>
        </div>
      )}
    </div>
  );
}
