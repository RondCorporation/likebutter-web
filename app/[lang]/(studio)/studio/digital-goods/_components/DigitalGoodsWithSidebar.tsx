'use client';

import { useState, useCallback } from 'react';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import BottomSheet from '@/components/BottomSheet';
import DigitalGoodsClient from './DigitalGoodsClient';
import DigitalGoodsStyleSidebar from './DigitalGoodsStyleSidebar';
import { DigitalGoodsStyle } from '@/lib/apis/task.api';

export default function DigitalGoodsWithSidebar() {
  const isDesktop = useIsDesktop();
  const [formData, setFormData] = useState<{
    style?: DigitalGoodsStyle;
    customPrompt?: string;
    title?: string;
    subtitle?: string;
    accentColor?: string;
    productName?: string;
    brandName?: string;
  }>({});

  const handleFormChange = useCallback((newFormData: typeof formData) => {
    setFormData(newFormData);
  }, []);

  if (isDesktop) {
    // 데스크톱: 기존 사이드바 레이아웃
    return (
      <div className="flex h-full w-full bg-studio-main overflow-hidden">
        <DigitalGoodsStyleSidebar onFormChange={handleFormChange} />
        <DigitalGoodsClient formData={formData} />
      </div>
    );
  }

  // 모바일: Bottom Sheet 레이아웃
  return (
    <div className="relative h-full w-full bg-studio-main">
      <div className="h-full overflow-y-auto">
        <DigitalGoodsClient formData={formData} />
      </div>

      <BottomSheet
        initialHeight={40}
        maxHeight={85}
        minHeight={20}
        className="bg-studio-sidebar"
      >
        <DigitalGoodsStyleSidebar onFormChange={handleFormChange} />
      </BottomSheet>
    </div>
  );
}
