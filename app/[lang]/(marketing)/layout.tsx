import { ReactNode } from 'react';
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

  // Load marketing-specific namespaces
  const marketingNamespaces = ['common', 'errors', 'marketing'];
  const { resources } = await initTranslations(lang, marketingNamespaces);

  return (
    <TranslationsProvider
      namespaces={marketingNamespaces}
      locale={lang}
      resources={resources}
    >
      <MarketingLayoutClient>
        <MarketingLayoutContent>{children}</MarketingLayoutContent>
      </MarketingLayoutClient>
    </TranslationsProvider>
  );
}
