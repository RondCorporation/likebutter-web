import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /^.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const segments = pathname.split('/');
  const locale = segments[1];

  if (['en', 'ko'].includes(locale)) {
    return;
  }

  let preferred = req.cookies.get('locale')?.value;
  if (!preferred) {
    const accept = req.headers.get('accept-language') || '';
    preferred = accept.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  const res = NextResponse.redirect(url);
  res.cookies.set('locale', preferred, { path: '/' });
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
