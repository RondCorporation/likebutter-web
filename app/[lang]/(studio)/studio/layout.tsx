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

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);
  const { t } = useTranslation(['studio', 'common']);
  const isDesktop = useIsDesktop();

  return (
    <StudioAuthGuard>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        {/* Header */}
        <Header variant="studio" params={params} />

        {/* Main content area - with top margin for desktop to account for fixed header */}
        <div className="flex flex-1 w-full bg-studio-main overflow-hidden md:mt-16">
          {/* Sidebar displayed only on desktop - Fixed position */}
          {isDesktop && (
            <div className="fixed left-0 top-16 bottom-0 z-20">
              <StudioSidebar lang={lang} />
            </div>
          )}

          {/* Main content - padding added for sidebar on desktop and bottom navigation on mobile */}
          <div className={`flex-1 ${isDesktop ? 'ml-20' : ''}`}>{children}</div>
        </div>

        {/* Bottom navigation displayed only on mobile */}
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
