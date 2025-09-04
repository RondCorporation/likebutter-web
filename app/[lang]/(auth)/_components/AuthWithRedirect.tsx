'use client';

import { useEffect, useState, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getMe } from '@/lib/apis/user.api';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

function AuthWithRedirectContent({ children }: { children: ReactNode }) {
  const [authStatus, setAuthStatus] = useState<
    'checking' | 'authenticated' | 'unauthenticated'
  >('checking');

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hydrate } = useAuthStore.getState();

  useEffect(() => {
    const verifyUserSession = async () => {
      try {
        const response = await getMe();

        if (response.data) {
          hydrate(response.data);
          setAuthStatus('authenticated');

          const lang = pathname.split('/')[1] || 'ko';
          let returnTo = searchParams.get('returnTo');

          if (!returnTo && pathname.includes('/login/success')) {
            returnTo = localStorage.getItem('oauthReturnTo');
            if (returnTo) {
              localStorage.removeItem('oauthReturnTo');
            }
          }

          const redirectUrl = returnTo
            ? decodeURIComponent(returnTo)
            : `/${lang}/studio`;

          window.location.replace(redirectUrl);
        } else {
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        setAuthStatus('unauthenticated');
      }
    };

    verifyUserSession();
  }, [pathname, searchParams, hydrate]);

  if (authStatus !== 'unauthenticated') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthWithRedirect({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-black">
          <LoaderCircle size={40} className="animate-spin text-accent" />
        </div>
      }
    >
      <AuthWithRedirectContent>{children}</AuthWithRedirectContent>
    </Suspense>
  );
}
