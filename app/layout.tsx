'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SettingsModal from '@/components/SettingsModal';
import Header from '@/components/Header';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useLangStore } from '@/stores/langStore';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith('/studio');
  const { lang, setLang } = useLangStore();

  useEffect(() => {
    const pathLang = pathname.split('/')[1];
    if (pathLang === 'en' || pathLang === 'ko') {
      setLang(pathLang as any);
    }
  }, [pathname, setLang]);

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        {showHeader && <Header />}
        {children}
        <SettingsModal />
      </body>
    </html>
  );
}
