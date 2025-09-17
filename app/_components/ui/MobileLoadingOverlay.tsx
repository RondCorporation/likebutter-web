'use client';

import { Loader2 } from 'lucide-react';

interface MobileLoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
}

export default function MobileLoadingOverlay({
  isVisible,
  title = '이미지 생성중',
  description = '잠시 기다리시면 결과가 나옵니다'
}: MobileLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center md:hidden">
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="w-16 h-16 animate-spin text-studio-button-primary" />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="text-white text-lg font-pretendard-medium">
            {title}
          </div>
          <div className="text-white/70 text-sm font-pretendard">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}