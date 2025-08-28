'use client';

import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import AuthInitializer from '@/app/_components/AuthInitializer';
import AuthGuard from '@/app/_components/AuthGuard';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import { AuthProvider } from '@/app/_contexts/AuthContext';
import StudioAuthGuard from './StudioAuthGuard';

interface StudioLayoutClientProps {
  children: ReactNode;
}

function StudioContent({ children }: { children: ReactNode }) {
  return (
    <StudioAuthGuard>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">{children}</main>
      </div>
    </StudioAuthGuard>
  );
}

export default function StudioLayoutClient({ children }: StudioLayoutClientProps) {
  return (
    <AuthProvider shouldInitializeAuth={true}>
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
          <StudioContent>{children}</StudioContent>
        </>
      </AuthInitializer>
    </AuthProvider>
  );
}