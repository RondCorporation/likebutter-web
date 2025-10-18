'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode, useEffect, useState } from 'react';
import initTranslations from '@/app/_lib/i18n-server';
import { createInstance } from 'i18next';
import i18nClient from '@/app/_lib/i18n-client';

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: any;
}) {
  const [i18nInstance] = useState(() => {
    // Use the global client instance for better compatibility
    const instance = i18nClient;

    // Add server-loaded resources to the client instance
    if (resources) {
      Object.keys(resources).forEach((lng) => {
        Object.keys(resources[lng]).forEach((ns) => {
          instance.addResourceBundle(lng, ns, resources[lng][ns], true, true);
        });
      });
    }

    // Change language if needed
    if (instance.language !== locale) {
      instance.changeLanguage(locale);
    }

    return instance;
  });

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
