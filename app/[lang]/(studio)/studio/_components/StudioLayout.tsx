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
  mobileBottomButton?: ReactNode; // 모바일 하단 버튼
  hideMobileBottomSheet?: boolean; // 모바일 바텀시트 숨김 여부
  hidePCSidebar?: boolean; // PC 사이드바 숨김 여부
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
    // Desktop: 기존 사이드바 레이아웃
    return (
      <div className="flex items-start h-full w-full bg-studio-main overflow-hidden">
        {!hidePCSidebar && sidebar}
        {children}
      </div>
    );
  }

  // Mobile: Bottom Sheet 레이아웃
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
