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
import { SpeedInsights } from '@vercel/speed-insights/next';

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
});

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

function getNamespacesForPath(pathname: string): string[] {
  const baseNamespaces = ['common', 'errors'];

  // Determine additional namespaces based on route
  if (pathname.includes('/studio') || pathname.includes('/billing')) {
    return [...baseNamespaces, 'studio', 'billing'];
  } else if (pathname.includes('/admin')) {
    return [...baseNamespaces, 'admin'];
  } else if (pathname.includes('/login') || pathname.includes('/signup')) {
    return [...baseNamespaces, 'auth'];
  } else {
    // Marketing pages
    return [...baseNamespaces, 'marketing'];
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const i18nNamespaces = ['common', 'errors', 'studio'];
  const { resources } = await initTranslations(lang, i18nNamespaces);

  const preloadedUser = await getMeOnServer();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'likebutter',
    url: 'https://likebutter.io',
    logo: 'https://likebutter.io/og-image.png',
    description:
      lang === 'ko'
        ? 'AI 기반 팬 콘텐츠 제작 플랫폼'
        : 'AI-powered fan content creation platform',
    sameAs: ['https://twitter.com/likebutter'],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'likebutter',
    url: 'https://likebutter.io',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://likebutter.io/${lang}/studio?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html
      lang={lang}
      dir={dir(lang)}
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivoBlack.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={lang}
          resources={resources}
        >
          <LayoutClient preloadedUser={preloadedUser}>{children}</LayoutClient>
        </TranslationsProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1.0,
    maximumScale: 1.0,
    minimumScale: 1.0,
    userScalable: false,
    viewportFit: 'cover',
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['seo']);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://likebutter.io';
  const title = t('default.title');
  const description = t('default.description');
  const keywords = t('default.keywords');
  const ogImage = `${baseUrl}/og-image.png`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
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
          type: 'image/png',
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
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'msapplication-TileColor': '#000000',
      'apple-mobile-web-app-title': 'likebutter',
      'application-name': 'likebutter',
      'og:image:secure_url': ogImage,
      'og:image:type': 'image/png',
      'og:image:width': '1200',
      'og:image:height': '630',
    },
  };
}
