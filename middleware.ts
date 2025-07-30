import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n.config.mjs';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string {
  const localeCookie = request.cookies.get('i18next')?.value;
  if (localeCookie && i18n.locales.includes(localeCookie)) {
    return localeCookie;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    i18n.locales
  );

  return matchLocale(languages, i18n.locales, i18n.defaultLocale);
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    [
      '/favicon.ico',
      '/file.svg',
      '/globe.svg',
      '/next.svg',
      '/vercel.svg',
      '/window.svg',
    ].includes(pathname)
  ) {
    return;
  }

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    const newUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
      request.url
    );

    return NextResponse.redirect(newUrl);
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|images|sw.js).*)'],
};
