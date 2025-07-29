'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';
import AuthInitializer from '@/components/AuthInitializer';
import '@/lib/i18n-client'; // Import to initialize i18next

export function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudioPage = pathname.includes('/studio');

  return (
    <AuthInitializer>
      <div className="flex min-h-screen flex-col">
        {!isStudioPage && <Header />}
        <main className="flex-grow">{children}</main>
        {!isStudioPage && <Footer />}
      </div>
    </AuthInitializer>
  );
}
