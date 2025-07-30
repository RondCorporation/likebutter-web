import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { ReactNode } from 'react';
import { i18n } from '@/i18n.config.mjs';
import { dir } from 'i18next';
import { Metadata } from 'next';
import { LayoutClient } from './_components/LayoutClient';
import { apiServer } from '@/app/_lib/apiServer';
import { User } from '@/app/_stores/authStore';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params;

  let preloadedUser: User | null = null;
  try {
    // This will fail if the user is not logged in, which is expected.
    // No need to log an error here.
    const res = await apiServer.get<User>('/users/me');
    preloadedUser = res.data ?? null;
  } catch (error) {
    // This catch block is intentionally empty.
    // Failing to preload a user is a normal flow for logged-out users.
    preloadedUser = null;
  }

  return (
    <html lang={lang} dir={dir(lang)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`}
      >
        <LayoutClient preloadedUser={preloadedUser}>{children}</LayoutClient>
      </body>
    </html>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'ko-KR': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/ko`,
      },
    },
  };
}
