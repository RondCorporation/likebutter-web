import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Archivo_Black } from 'next/font/google';
import '../globals.css';
import { ReactNode } from 'react';
import { i18n } from '@/i18n.config.mjs';
import { dir } from 'i18next';
import { Metadata } from 'next';
import { LayoutClient } from './_components/LayoutClient';
import initTranslations from '../_lib/i18n-server';
import TranslationsProvider from '../_components/TranslationsProvider';
import { getMeOnServer } from '../_lib/apiServer';
import GoogleAnalytics from '../_components/GoogleAnalytics';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const i18nNamespaces = [
  'common',
  'auth',
  'marketing',
  'billing',
  'studio',
  'admin',
  'errors',
];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;
  const { resources } = await initTranslations(lang, i18nNamespaces);

  const preloadedUser = await getMeOnServer();

  return (
    <html
      lang={lang}
      dir={dir(lang)}
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivoBlack.variable}`}
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={lang}
          resources={resources}
        >
          {/* 가져온 사용자 정보를 preloadedUser prop으로 전달합니다 */}
          <LayoutClient preloadedUser={preloadedUser}>{children}</LayoutClient>
        </TranslationsProvider>
      </body>
    </html>
  );
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = 'likebutter';
  const description =
    'AI-powered fan content creation platform. Transform your fan love into art, music, and virtual content with Butter Studio.';
  const ogImage = `${baseUrl}/og-image.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    viewport: {
      width: 'device-width',
      initialScale: 1.0,
      maximumScale: 1.0,
      minimumScale: 1.0,
      userScalable: false,
      viewportFit: 'cover',
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${lang}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'likebutter',
      locale: lang === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@likebutter',
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'ko-KR': `${baseUrl}/ko`,
        'x-default': `${baseUrl}/ko`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      'msapplication-TileColor': '#000000',
      'apple-mobile-web-app-title': 'likebutter',
      'application-name': 'likebutter',
    },
  };
}
