import { Metadata } from 'next';

export type LocalizedMetadataParams = {
  lang: string;
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  ogImage?: string;
};

const SITE_URL = 'https://likebutter.io';
const DEFAULT_OG_IMAGE = '/og-image.png';

export function generateLocalizedMetadata({
  lang,
  title,
  description,
  keywords,
  path = '',
  ogImage = DEFAULT_OG_IMAGE,
}: LocalizedMetadataParams): Metadata {
  const url = `${SITE_URL}/${lang}${path}`;
  const locale = lang === 'ko' ? 'ko_KR' : 'en_US';
  const alternateLocale = lang === 'ko' ? 'en_US' : 'ko_KR';

  const metadata: Metadata = {
    title,
    description,
    ...(keywords && { keywords }),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `/en${path}`,
        ko: `/ko${path}`,
        'x-default': `/ko${path}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'likebutter',
      locale,
      alternateLocale: [alternateLocale],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
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
  };

  return metadata;
}

export function generatePageMetadata(
  lang: string,
  titleKey: string,
  descriptionKey: string,
  keywordsKey?: string,
  path?: string,
  ogImage?: string
) {
  return {
    lang,
    titleKey,
    descriptionKey,
    keywordsKey,
    path,
    ogImage,
  };
}
