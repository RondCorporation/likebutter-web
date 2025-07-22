'use client';

import i18n from '@/lib/i18n-client';
import { I18nextProvider } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import AuthInitializer from '@/components/AuthInitializer';
import Header from '@/components/Header';
import SettingsModal from '@/components/SettingsModal';

export function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.includes('/studio');

  return (
    <I18nextProvider i18n={i18n}>
      <AuthInitializer>
        {showHeader && <Header />}
        {children}
        <SettingsModal />
      </AuthInitializer>
    </I18nextProvider>
  );
}
