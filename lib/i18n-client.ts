'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18n } from '@/i18n.config.mjs';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...i18n,
    fallbackLng: i18n.defaultLocale,
    supportedLngs: i18n.locales,

    ns: ['common'],
    defaultNS: 'common',
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
  });

export default i18next;
