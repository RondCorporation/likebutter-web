'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

function RedirectHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lang = pathname.split('/')[1] || 'en';

    const returnTo = localStorage.getItem('oauthReturnTo');
    localStorage.removeItem('oauthReturnTo');

    const redirectUrl = returnTo || `/${lang}/studio`;

    if (redirectUrl.startsWith('/')) {
      window.location.replace(redirectUrl);
    } else {
      window.location.replace(`/${lang}/studio`);
    }
  }, []);

  return <LoaderCircle className="h-12 w-12 animate-spin text-accent" />;
}

export default function LoginSuccessPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <Suspense
        fallback={
          <LoaderCircle className="h-12 w-12 animate-spin text-accent" />
        }
      >
        <RedirectHandler />
      </Suspense>
    </div>
  );
}
