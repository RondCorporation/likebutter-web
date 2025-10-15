import { ReactNode } from 'react';
import StudioLayoutClient from './_components/StudioLayoutClient';
import initTranslations from '@/app/_lib/i18n-server';
import TranslationsProvider from '@/app/_components/TranslationsProvider';

interface StudioLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function StudioLayout({
  children,
  params,
}: StudioLayoutProps) {
  const { lang } = await params;

  // Load studio-specific namespaces
  const studioNamespaces = ['common', 'errors', 'studio', 'billing'];
  const { resources } = await initTranslations(lang, studioNamespaces);

  return (
    <TranslationsProvider
      namespaces={studioNamespaces}
      locale={lang}
      resources={resources}
    >
      <StudioLayoutClient>{children}</StudioLayoutClient>
    </TranslationsProvider>
  );
}
