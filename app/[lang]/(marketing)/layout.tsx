import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { MarketingLayoutClient } from './_components/MarketingLayoutClient';
import MarketingLayoutContent from './_components/MarketingLayoutContent';
import initTranslations from '@/app/_lib/i18n-server';
import TranslationsProvider from '@/app/_components/TranslationsProvider';

interface MarketingLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function MarketingLayout({
  children,
  params,
}: MarketingLayoutProps) {
  const { lang } = await params;

  const marketingNamespaces = ['common', 'errors', 'marketing'];
  const { resources } = await initTranslations(lang, marketingNamespaces);

  const cookieStore = await cookies();
  const hasToken = cookieStore.get('accessToken') !== undefined;

  return (
    <TranslationsProvider
      namespaces={marketingNamespaces}
      locale={lang}
      resources={resources}
    >
      <MarketingLayoutClient hasToken={hasToken}>
        <MarketingLayoutContent>{children}</MarketingLayoutContent>
      </MarketingLayoutClient>
    </TranslationsProvider>
  );
}
