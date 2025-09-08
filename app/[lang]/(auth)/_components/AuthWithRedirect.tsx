'use client';

import { useEffect, ReactNode, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/app/_stores/authStore';

function AuthWithRedirectContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitialized, isLoading } = useAuthStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (pathname.includes('/login/success')) {
      return;
    }

    if (isAuthenticated) {
      const lang = pathname.split('/')[1] || 'ko';
      const returnTo = searchParams.get('returnTo');

      const redirectUrl = returnTo
        ? decodeURIComponent(returnTo)
        : `/${lang}/studio`;

      window.location.replace(redirectUrl);
    }
  }, [isInitialized, isLoading, isAuthenticated, pathname, searchParams]);

  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  if (pathname.includes('/login/success')) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
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
