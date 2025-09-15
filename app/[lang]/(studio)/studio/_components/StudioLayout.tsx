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
}

export default function StudioLayout({
  sidebar,
  children,
  bottomSheetOptions = {
    initialHeight: 40,
    maxHeight: 85,
    minHeight: 20,
  },
}: StudioLayoutProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    // Desktop: 기존 사이드바 레이아웃
    return (
      <div className="flex items-start h-full w-full bg-studio-main overflow-hidden">
        {sidebar}
        {children}
      </div>
    );
  }

  // Mobile: Bottom Sheet 레이아웃
  return (
    <div className="relative h-full w-full bg-studio-main">
      <div className="h-full overflow-y-auto">{children}</div>

      <BottomSheet
        initialHeight={bottomSheetOptions.initialHeight}
        maxHeight={bottomSheetOptions.maxHeight}
        minHeight={bottomSheetOptions.minHeight}
        className="bg-studio-sidebar"
      >
        {sidebar}
      </BottomSheet>
    </div>
  );
}
