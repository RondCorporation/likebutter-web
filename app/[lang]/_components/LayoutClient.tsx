'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SettingsModal from '@/components/SettingsModal';
import { Toaster } from 'react-hot-toast';
import '@/lib/i18n-client';

export function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudioPage = pathname.includes('/studio');

  return (
    <AuthInitializer>
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
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
    </AuthInitializer>
  );
}
