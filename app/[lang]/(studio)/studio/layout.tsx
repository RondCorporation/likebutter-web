'use client';

import { ReactNode, use } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import StudioAuthGuard from '../_components/StudioAuthGuard';
import Header from '@/app/_components/Header';
import StudioSidebar from './_components/StudioSidebar';
import MobileBottomNavigation from './_components/MobileBottomNavigation';
import StudioPreloader from './_components/StudioPreloader';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useViewportHeight } from '@/app/_hooks/useViewportHeight';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);
  const { t } = useTranslation(['studio', 'common']);
  const isDesktop = useIsDesktop();

  // 모바일 viewport height 문제 해결을 위한 훅
  useViewportHeight();

  return (
    <StudioAuthGuard>
      <div className="flex flex-col w-full overflow-hidden h-dvh-fallback">
        {/* Fixed Header - 모바일과 데스크톱 모두 고정 */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header variant="studio" params={params} />
        </div>

        {/* Main content area */}
        <div className="flex flex-1 w-full bg-studio-main overflow-hidden mt-16">
          {/* Sidebar displayed only on desktop - Fixed position */}
          {isDesktop && (
            <div className="fixed left-0 top-16 bottom-0 z-20">
              <StudioSidebar lang={lang} />
            </div>
          )}

          {/* Main content - 데스크톱: 사이드바 여백, 모바일: 하단 네비게이션 여백 */}
          <div
            className={`flex-1 overflow-y-auto ${isDesktop ? 'ml-20' : 'mb-[88px]'}`}
            style={
              !isDesktop
                ? {
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehavior: 'contain',
                  }
                : undefined
            }
          >
            {children}
          </div>
        </div>

        {/* Fixed Bottom navigation - 모바일만 표시 */}
        {!isDesktop && <MobileBottomNavigation lang={lang} />}

        {/* Component preloader for better performance */}
        <StudioPreloader lang={lang} />

        <Toaster
          position={isDesktop ? 'top-right' : 'top-center'}
          containerStyle={
            isDesktop
              ? {
                  top: 80,
                  right: 20,
                }
              : {
                  top: 70,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
          }
          toastOptions={{
            duration: 3000,
            className: 'studio-toast',
            style: {
              background: '#1f2937',
              color: '#ffffff',
              border: '1px solid #374151',
              borderRadius: '8px',
              padding: isDesktop ? '12px 16px' : '10px 14px',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '1.5',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: isDesktop ? '480px' : '90%',
              minWidth: isDesktop ? 'auto' : '280px',
              width: 'auto',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#1f2937',
              },
              style: {
                border: '1px solid #10b981',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1f2937',
              },
              style: {
                border: '1px solid #ef4444',
              },
            },
            loading: {
              iconTheme: {
                primary: '#f59e0b',
                secondary: '#1f2937',
              },
              style: {
                border: '1px solid #f59e0b',
              },
            },
          }}
        />
      </div>
    </StudioAuthGuard>
  );
}
