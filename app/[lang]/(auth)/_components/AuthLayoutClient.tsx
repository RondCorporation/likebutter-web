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
          <div className="flex flex-col h-screen w-full overflow-hidden">
            <div
              className="flex-1 overflow-y-auto bg-black text-white"
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {children}
            </div>
          </div>
        </AuthWithRedirect>
      </>
    </AuthInitializer>
  );
}
