import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../globals.css';
import { ReactNode } from 'react';
import { i18n } from '@/i18n.config.mjs';
import { dir } from 'i18next';
import { Metadata } from 'next';
import { LayoutClient } from './_components/LayoutClient';
import initTranslations from '../_lib/i18n-server';
import TranslationsProvider from '../_components/TranslationsProvider';
import { User } from '@/app/_types/api';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

const i18nNamespaces = ['common'];

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;
  const { resources } = await initTranslations(lang, i18nNamespaces);

  return (
    <html
      lang={lang}
      dir={dir(lang)}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={lang}
          resources={resources}
        >
          <LayoutClient preloadedUser={null}>{children}</LayoutClient>
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
  const description = 'AI-powered video creation';
  const ogImage = `${baseUrl}/og-image.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/${lang}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
    },
  };
}
