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
      <div className="flex items-start h-screen w-full bg-studio-main overflow-hidden">
        {!hidePCSidebar && sidebar}
        {children}
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

      {!hideMobileBottomSheet && (
        <BottomSheet
          initialHeight={bottomSheetOptions.initialHeight}
          maxHeight={bottomSheetOptions.maxHeight}
          minHeight={bottomSheetOptions.minHeight}
          className="bg-studio-sidebar"
          bottomButton={mobileBottomButton}
        >
          {sidebar}
        </BottomSheet>
      )}
    </div>
  );
}
