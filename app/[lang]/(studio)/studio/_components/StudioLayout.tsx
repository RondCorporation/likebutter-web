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
      <div
        className="h-full overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </div>

      {/* Bottom sheet */}
      {!hideMobileBottomSheet && (
        <BottomSheet
          initialHeight={bottomSheetOptions.initialHeight}
          maxHeight={bottomSheetOptions.maxHeight}
          minHeight={bottomSheetOptions.minHeight}
          className="bg-studio-sidebar"
          hasBottomButton={!!mobileBottomButton}
        >
          {sidebar}
        </BottomSheet>
      )}

      {/* Fixed bottom button - above navigation */}
      {mobileBottomButton && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-studio-sidebar pb-20">
          <div className="px-3 pt-3 pb-6">{mobileBottomButton}</div>
        </div>
      )}
    </div>
  );
}
