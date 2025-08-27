'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/_stores/authStore';

export default function AuthRedirectHandler() {
  const { user, isInitialized, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !isInitialized) {
      return;
    }

    // Extract language from pathname
    const segments = pathname.split('/');
    const lang = segments[1];
    const authPath = segments.slice(2).join('/'); // Remove lang and get auth path
    
    const isAuthPage = authPath === 'login' || 
                      authPath === 'signup' || 
                      authPath === 'login/success';

    // If user is authenticated and on an auth page, redirect to studio or returnTo
    if (user && isAuthPage) {
      const returnTo = searchParams.get('returnTo');
      const redirectUrl = returnTo || `/${lang}/studio`;
      router.replace(redirectUrl);
    }
  }, [
    user,
    isInitialized,
    isLoading,
    router,
    pathname,
    searchParams,
  ]);

  return null;
}