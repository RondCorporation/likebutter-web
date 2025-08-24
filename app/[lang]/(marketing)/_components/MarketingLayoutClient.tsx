'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import { AuthProvider } from '@/app/_contexts/AuthContext';

interface MarketingLayoutClientProps {
  children: ReactNode;
}

export function MarketingLayoutClient({ children }: MarketingLayoutClientProps) {
  return (
    <AuthProvider shouldInitializeAuth={false}>
      <>
        <ServerErrorDisplay />
        <ConditionalSettingsModal />
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
          <main className="flex-grow">{children}</main>
        </div>
      </>
    </AuthProvider>
  );
}