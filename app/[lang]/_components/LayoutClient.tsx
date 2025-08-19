'use client';

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import { Toaster } from 'react-hot-toast';
import '@/lib/i18n-client';
import { usePathname } from 'next/navigation';
import AuthInitializer from '@/components/AuthInitializer';
import ServerErrorDisplay from '@/components/shared/ServerErrorDisplay';
import { User } from '@/stores/authStore';

export function LayoutClient({
  children,
  preloadedUser,
}: {
  children: ReactNode;
  preloadedUser: User | null;
}) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const isMarketingPage = pathname === `/${lang}`;
  const isStudioPage = pathname.includes('/studio');
  const isAdminPage = pathname.includes('/admin');

  return (
    <AuthInitializer preloadedUser={preloadedUser}>
      <>
        <ServerErrorDisplay />
        <SettingsModal />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <div className="flex min-h-screen flex-col">
          {!isStudioPage && !isAdminPage && !isMarketingPage && <Header />}
          <main className="flex-grow">{children}</main>
          {!isStudioPage && !isAdminPage && !isMarketingPage && <Footer />}
        </div>
      </>
    </AuthInitializer>
  );
}
