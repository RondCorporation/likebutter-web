import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { i18n } from '@/i18n.config.mjs';
import path from 'path';
import fs from 'fs';

const translationsCache: Record<string, any> = {};

const initTranslations = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance.use(initReactI18next).init({
    lng: locale,
    fallbackLng: i18n.defaultLocale,
    supportedLngs: i18n.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    resources: {},
  });

  for (const ns of namespaces) {
    const cacheKey = `${locale}-${ns}`;
    if (translationsCache[cacheKey]) {
      i18nInstance.addResourceBundle(locale, ns, translationsCache[cacheKey]);
      continue;
    }

    const filePath = path.join(
      process.cwd(),
      'public',
      'locales',
      locale,
      `${ns}.json`
    );
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const resources = JSON.parse(fileContent);
      translationsCache[cacheKey] = resources;
      i18nInstance.addResourceBundle(locale, ns, resources);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        console.warn(`Translation file not found: ${filePath}`);
      } else {
        console.error(`Could not load translations for ${locale}/${ns}`, error);
      }
    }
  }

  return i18nInstance;
};

export default initTranslations;
