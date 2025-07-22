import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { i18n } from '@/i18n.config.mjs';
import path from 'path';
import fs from 'fs';

const initTranslations = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: i18n.defaultLocale,
    supportedLngs: i18n.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    resources: {}, // Resources will be loaded below
  });

  // Load resources
  for (const ns of namespaces) {
    const filePath = path.resolve(`./public/locales/${locale}/${ns}.json`);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      i18nInstance.addResourceBundle(locale, ns, JSON.parse(fileContent));
    } catch (error) {
      console.error(`Could not load translations for ${locale}/${ns}`, error);
    }
  }

  return i18nInstance;
};

export default initTranslations;
