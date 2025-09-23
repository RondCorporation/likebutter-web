'use client';

import { ReactNode, use } from 'react';
import { Toaster } from 'react-hot-toast';
import StudioAuthGuard from '../_components/StudioAuthGuard';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import StudioSidebar from './_components/StudioSidebar';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import StudioPreloader from './_components/StudioPreloader';
import StudioUserDropdown from './_components/StudioUserDropdown';
import Logo from '@/components/Logo';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_hooks/useAuth';
import { useCredit } from '@/app/_hooks/useCredit';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);
  const isDesktop = useIsDesktop();
  const router = useRouter();
  const { user } = useAuth();
  const { currentBalance, isLoading: isCreditLoading } = useCredit();

  const handleUpgradeClick = () => {
    router.push(`/${lang}/billing`);
  };

  const showUpgradeButton = user?.planKey === 'FREE';

  return (
    <StudioAuthGuard>
      <div className="flex flex-col min-h-screen w-full">
        {/* 헤더 - 모바일에서는 padding 조정 */}
        <div className="flex h-16 items-center justify-end gap-2.5 px-4 md:px-8 py-5 w-full bg-studio-header border-b border-solid border-studio-border">
          <Logo className="relative flex-1 mt-[-3.00px] mb-[-1.00px] tracking-[0]" />

          <div className="inline-flex items-center justify-end gap-4 relative flex-[0_0_auto]">
            {/* Credit Information */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md bg-studio-sidebar border border-studio-border">
              <Image
                src="/credit.svg"
                alt="credit"
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              <span className="text-studio-text-primary text-sm font-semibold">
                {isCreditLoading ? '...' : currentBalance.toLocaleString()}
              </span>
              <span className="text-studio-text-secondary text-xs">크레딧</span>
            </div>

            {/* Upgrade Button - Only for FREE plan users */}
            {showUpgradeButton && (
              <button
                onClick={handleUpgradeClick}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border-2 border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="font-semibold text-sm text-yellow-400 whitespace-nowrap">
                  업그레이드
                </span>
              </button>
            )}

            <div className="inline-flex items-center justify-center gap-4 relative flex-[0_0_auto]">
              <StudioUserDropdown />
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

        {/* Component preloader for better performance */}
        <StudioPreloader lang={lang} />

        <Toaster
          position="top-right"
          containerStyle={{
            top: 80,
            right: 20,
          }}
          toastOptions={{
            duration: 3000,
            className: 'studio-toast',
            style: {
              background: 'rgba(37, 40, 44, 0.95)',
              color: '#ffffff',
              border: '1px solid #313131',
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: '420px',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#25282c',
              },
              style: {
                background:
                  'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(37, 40, 44, 0.95) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                color: '#ffffff',
                boxShadow:
                  '0 20px 25px -5px rgba(74, 222, 128, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#25282c',
              },
              style: {
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(37, 40, 44, 0.95) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ffffff',
                boxShadow:
                  '0 20px 25px -5px rgba(239, 68, 68, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
              },
            },
            loading: {
              iconTheme: {
                primary: '#ffd93b',
                secondary: '#25282c',
              },
              style: {
                background:
                  'linear-gradient(135deg, rgba(255, 217, 59, 0.1) 0%, rgba(37, 40, 44, 0.95) 100%)',
                border: '1px solid rgba(255, 217, 59, 0.3)',
                color: '#ffffff',
              },
            },
          }}
        />
      </div>
    </StudioAuthGuard>
  );
}
