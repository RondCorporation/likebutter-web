'use client';

import { ReactNode, useEffect, useRef } from 'react';
import '@/app/_lib/i18n-client';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import AuthInitializer from '@/app/_components/AuthInitializer';
import { ScrollContextProvider } from '../_context/ScrollContext';
import { useAuthStore } from '@/app/_stores/authStore';

interface MarketingLayoutClientProps {
  children: ReactNode;
  hasToken: boolean;
}

export function MarketingLayoutClient({
  children,
  hasToken,
}: MarketingLayoutClientProps) {
  // Set hasTokenFromServer IMMEDIATELY before any render
  const isTokenSet = useRef(false);
  if (!isTokenSet.current) {
    useAuthStore.getState().setHasTokenFromServer(hasToken);
    isTokenSet.current = true;
  }

  return (
    <ScrollContextProvider>
      <AuthInitializer
        preloadedUser={null}
        skipInitialization={false}
        showLoader={false}
        hasTokenFromServer={hasToken}
      >
        <>
          <ServerErrorDisplay />
          <ConditionalSettingsModal />
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </>
      </AuthInitializer>
    </ScrollContextProvider>
  );
}
