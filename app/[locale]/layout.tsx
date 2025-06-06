'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css'; // Corrected path
import SettingsModal from '@/components/SettingsModal';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
  params: {locale} // Added locale param
}: {
  children: ReactNode;
  params: {locale: string};
}) {
  const pathname = usePathname();
  // Pathname will include locale, e.g., /en/studio or /ko/studio
  const showHeader = !pathname.startsWith(`/${locale}/studio`);
  const messages = useMessages();

  return (
    <html lang={locale}> {/* Dynamic lang */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {showHeader && <Header />}
          {children}
          <SettingsModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
