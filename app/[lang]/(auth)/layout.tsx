import { ReactNode } from 'react';
import AuthLayoutClient from './_components/AuthLayoutClient';
import initTranslations from '@/app/_lib/i18n-server';
import TranslationsProvider from '@/app/_components/TranslationsProvider';

interface AuthLayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { lang } = await params;

  // Load auth-specific namespaces
  const authNamespaces = ['auth'];
  const { resources } = await initTranslations(lang, authNamespaces);

  return (
    <TranslationsProvider
      namespaces={authNamespaces}
      locale={lang}
      resources={resources}
    >
      <AuthLayoutClient>{children}</AuthLayoutClient>
    </TranslationsProvider>
  );
}
