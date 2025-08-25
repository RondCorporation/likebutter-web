'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

/**
 * This component's only job is to redirect the user after a successful login.
 * The backend is responsible for setting the accessToken cookie via a Set-Cookie header
 * during the redirect to this page. This component simply reads the destination
 * from localStorage and sends the user there.
 */
function RedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // localStorage는 클라이언트에서만 접근
    if (typeof window === 'undefined') return;
    
    const lang = pathname.split('/')[1] || 'en';
    // SocialButtons component now saves the full, absolute path.
    const returnTo =
      localStorage.getItem('oauthReturnTo') || `/${lang}/studio`;
    localStorage.removeItem('oauthReturnTo');
    router.replace(returnTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

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
