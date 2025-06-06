// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, getLocaleFromHeaders } from './i18n'; // Use './i18n' as it's at the root

const PUBLIC_FILE = /\.(.*)$/; // Matches files with extensions (e.g. .jpg, .svg)
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'; // Cookie name for storing locale

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets, images, api routes etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    let locale: string | undefined;

    // 1. Try to get locale from cookie
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieLocale && locales.includes(cookieLocale)) {
      locale = cookieLocale;
    }

    // 2. If no cookie or invalid cookie, try to get locale from 'Accept-Language' header
    if (!locale) { // This also covers invalid cookieLocale
      locale = getLocaleFromHeaders(request.headers); // This will fall back to defaultLocale if needed
    }

    // Fallback to defaultLocale if somehow getLocaleFromHeaders didn't return one (should not happen with current i18n.ts)
    if (!locale) {
        locale = defaultLocale;
    }

    // Construct the new URL with the determined locale
    const newPath = pathname === '/' ? '' : pathname; // Avoids // for root path
    const newUrl = new URL(`/${locale}${newPath}`, request.url);

    const response = NextResponse.redirect(newUrl);
    // Set/update cookie for future requests
    // Only set if the determined locale is different from a potentially existing (but invalid/not preferred) cookie
    if (cookieLocale !== locale) {
        response.cookies.set(LOCALE_COOKIE_NAME, locale, { path: '/', maxAge: 365 * 24 * 60 * 60 }); // 1 year
    }
    return response;
  }

  // If locale is in the pathname, try to set/update the cookie
  // This part ensures the cookie is updated if a user explicitly navigates to a different locale path
  const currentPathLocale = locales.find(loc => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);
  if (currentPathLocale) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieLocale !== currentPathLocale) {
      const response = NextResponse.next(); // Allow the request to proceed
      response.cookies.set(LOCALE_COOKIE_NAME, currentPathLocale, { path: '/', maxAge: 365 * 24 * 60 * 60 }); // 1 year
      return response; // Return the response with the updated cookie
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and specific files/folders
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|static).*)']
};
