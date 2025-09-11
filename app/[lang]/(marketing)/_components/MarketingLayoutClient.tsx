'use client';

import { ReactNode } from 'react';
import '@/app/_lib/i18n-client';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import AuthInitializer from '@/app/_components/AuthInitializer';

interface MarketingLayoutClientProps {
  children: ReactNode;
}

export function MarketingLayoutClient({
  children,
}: MarketingLayoutClientProps) {
  return (
    <AuthInitializer
      preloadedUser={null}
      skipInitialization={false}
      showLoader={false}
    >
      <>
        <ServerErrorDisplay />
        <ConditionalSettingsModal />
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
        </div>
      </>
    </AuthInitializer>
  );
}
