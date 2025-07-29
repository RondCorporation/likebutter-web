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

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (required && !user) {
      console.log('AuthGuard: User not found. Redirecting to login.');
      const loginUrl = new URL('/login', window.location.origin);
      loginUrl.searchParams.set('returnTo', pathname);
      router.replace(loginUrl.toString());
      return;
    }

    if (user && isAuthPage) {
      console.log('AuthGuard: User already logged in. Redirecting...');
      const returnTo = searchParams.get('returnTo');
      router.replace(returnTo || '/studio');
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
