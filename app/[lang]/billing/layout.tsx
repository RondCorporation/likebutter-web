import { ReactNode } from 'react';
import initTranslations from '@/app/_lib/i18n-server';
import TranslationsProvider from '@/app/_components/TranslationsProvider';

interface BillingLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function BillingLayout({
  children,
  params,
}: BillingLayoutProps) {
  const { lang } = await params;

  // Load billing-specific namespaces
  const billingNamespaces = ['billing'];
  const { resources } = await initTranslations(lang, billingNamespaces);

  return (
    <TranslationsProvider
      namespaces={billingNamespaces}
      locale={lang}
      resources={resources}
    >
      {children}
    </TranslationsProvider>
  );
}
