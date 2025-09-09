'use client';

import { useIsDesktop } from '@/hooks/useMediaQuery';
import BottomSheet from '@/components/BottomSheet';
import DigitalGoodsClient from './DigitalGoodsClient';
import DigitalGoodsStyleSidebar from './DigitalGoodsStyleSidebar';

export default function DigitalGoodsWithSidebar() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    // 데스크톱: 기존 사이드바 레이아웃
    return (
      <div className="flex h-full w-full bg-studio-main overflow-hidden">
        <DigitalGoodsStyleSidebar />
        <DigitalGoodsClient />
      </div>
    );
  }

  // 모바일: Bottom Sheet 레이아웃
  return (
    <div className="relative h-full w-full bg-studio-main">
      <div className="h-full overflow-y-auto">
        <DigitalGoodsClient />
      </div>

      <BottomSheet
        initialHeight={40}
        maxHeight={85}
        minHeight={20}
        className="bg-studio-sidebar"
      >
        <DigitalGoodsStyleSidebar />
      </BottomSheet>
    </div>
  );
}
