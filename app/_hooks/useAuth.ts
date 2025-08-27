'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export function useAuth(required = true) {
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
    const routePath = segments.slice(2).join('/'); // Remove lang and get route path
    
    const isAuthPage = routePath === 'login' || 
                      routePath === 'signup' ||
                      routePath === 'login/success';

    if (required && !user) {
      const returnToParam = encodeURIComponent(pathname);
      router.replace(`/${lang}/login?returnTo=${returnToParam}`);
      return;
    }

    if (user && isAuthPage) {
      const returnTo = searchParams.get('returnTo');
      router.replace(returnTo || `/${lang}/studio`);
    }
  }, [
    user,
    isInitialized,
    isLoading,
    required,
    router,
    pathname,
    searchParams,
  ]);

  return { user, isLoading: !isInitialized || isLoading };
}
