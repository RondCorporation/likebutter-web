'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import '@/app/_lib/i18n-client';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import AuthInitializer from '@/app/_components/AuthInitializer';
import AuthWithRedirect from './AuthWithRedirect';

interface AuthLayoutClientProps {
  children: ReactNode;
}

export default function AuthLayoutClient({ children }: AuthLayoutClientProps) {
  const pathname = usePathname();

  if (pathname.includes('/login/success')) {
    return <>{children}</>;
  }

  return (
    <AuthInitializer
      preloadedUser={null}
      skipInitialization={false}
      showLoader={true}
    >
      <>
        <ServerErrorDisplay />
        <ConditionalSettingsModal />
        <AuthWithRedirect>
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </AuthWithRedirect>
      </>
    </AuthInitializer>
  );
}
