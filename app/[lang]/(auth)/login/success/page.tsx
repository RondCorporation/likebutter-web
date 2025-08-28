'use client';

import { useEffect, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

/**
 * This component handles redirect after successful OAuth login.
 * The backend sets the accessToken cookie and redirects to this page.
 * We directly navigate to the destination using window.location to ensure
 * a fresh page load with proper authentication state.
 */
function RedirectHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lang = pathname.split('/')[1] || 'en';

    // Get returnTo from localStorage (set by SocialButtons)
    const returnTo = localStorage.getItem('oauthReturnTo');
    localStorage.removeItem('oauthReturnTo');

    // Default fallback to studio page
    const redirectUrl = returnTo || `/${lang}/studio`;

    // Use window.location for immediate redirect after OAuth success
    if (redirectUrl.startsWith('/')) {
      window.location.href = redirectUrl;
    } else {
      window.location.href = `/${lang}/studio`;
    }
  }, [pathname]);

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
