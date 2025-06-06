// i18n.ts
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {match} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const locales = ['en', 'ko'];
export const defaultLocale = 'en';

// Function to get locale from headers (for middleware)
export function getLocaleFromHeaders(headers: Headers): string {
  const negotiatorHeaders: Record<string, string> = {};
  headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore formats are available in the types
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  return match(languages, locales, defaultLocale);
}

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
