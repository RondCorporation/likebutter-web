'use client';

import { ReactNode, use } from 'react';
import { Toaster } from 'react-hot-toast';
import StudioAuthGuard from '../_components/StudioAuthGuard';
import { Settings } from 'lucide-react';
import StudioSidebar from './_components/StudioSidebar';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import Logo from '@/components/Logo';
import { useIsDesktop } from '@/hooks/useMediaQuery';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);
  const isDesktop = useIsDesktop();

  return (
    <StudioAuthGuard>
      <div className="flex flex-col min-h-screen w-full">
        {/* 헤더 - 모바일에서는 padding 조정 */}
        <div className="flex h-16 items-center justify-end gap-2.5 px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border">
          <Logo className="relative flex-1 mt-[-3.00px] mb-[-1.00px] tracking-[0]" />

          <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
            <div className="inline-flex items-center overflow-hidden rounded-md justify-center relative">
              <div
                className="font-semibold w-fit mt-[-2.00px] tracking-[0] text-sm text-studio-button-primary leading-[14px] whitespace-nowrap relative"
                style={{ fontFamily: 'Pretendard, Helvetica' }}
              >
                Button text
              </div>
            </div>
            <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
              <Settings className="w-6 h-6" color="#A8A8AA" />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1 w-full bg-studio-main overflow-hidden">
          {/* 데스크톱에서만 사이드바 표시 */}
          {isDesktop && <StudioSidebar lang={lang} />}

          {/* 메인 콘텐츠 - 모바일에서는 하단 네비게이션을 위한 패딩 추가 */}
          <div className={`flex-1 ${!isDesktop ? 'pb-20' : ''}`}>
            {children}
          </div>
        </div>

        {/* 모바일에서만 하단 네비게이션 표시 */}
        {!isDesktop && <MobileBottomNavigation lang={lang} />}

        <Toaster position="top-right" />
      </div>
    </StudioAuthGuard>
  );
}
