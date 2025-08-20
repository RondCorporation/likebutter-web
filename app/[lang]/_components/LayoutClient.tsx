'use client';

import { ReactNode } from 'react';
import SettingsModal from '@/app/_components/SettingsModal';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import AuthInitializer from '@/app/_components/AuthInitializer';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import { User } from '@/app/_types/api';

export function LayoutClient({
  children,
  preloadedUser,
}: {
  children: ReactNode;
  preloadedUser: User | null;
}) {
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
          <main className="flex-grow">{children}</main>
        </div>
      </>
    </AuthInitializer>
  );
}
