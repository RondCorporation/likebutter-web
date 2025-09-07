'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import AuthInitializer from '@/app/_components/AuthInitializer';
import AuthWithRedirect from './AuthWithRedirect';

interface AuthLayoutClientProps {
  children: ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  return (
    <AuthInitializer
      preloadedUser={null}
      skipInitialization={false}
      showLoader={true}
    >
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
        <AuthWithRedirect>
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </AuthWithRedirect>
      </>
    </AuthInitializer>
  );
}
