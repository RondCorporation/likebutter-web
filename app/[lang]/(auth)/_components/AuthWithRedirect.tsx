'use client';

import { useEffect, useRef, ReactNode, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/_stores/authStore';
import { getMe } from '@/app/_lib/apis/user.api';
import { LoaderCircle } from 'lucide-react';

interface AuthWithRedirectProps {
  children: ReactNode;
}

function AuthWithRedirectContent({ children }: AuthWithRedirectProps) {
  const { user, isInitialized, isLoading, setLoading, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializationAttempted = useRef(false);

  // Initial auth check on page load
  useEffect(() => {
    if (initializationAttempted.current || isInitialized) return;
    initializationAttempted.current = true;

    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const { data: user } = await getMe();
        if (user) {
          // User is authenticated, redirect immediately
          setUser(user);
          
          const segments = pathname.split('/');
          const lang = segments[1];
          const returnTo = searchParams.get('returnTo');
          const redirectUrl = returnTo || `/${lang}/studio`;
          
          router.replace(redirectUrl);
          return;
        }
      } catch (error) {
        // User is not authenticated, this is expected for auth pages
      } finally {
        setLoading(false);
        // Mark as initialized after we've checked auth status
        useAuthStore.setState({ isInitialized: true });
      }
    };

    initializeAuth();
  }, [setLoading, setUser, router, pathname, searchParams, isInitialized]);

  // Show loading while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  // If user is authenticated, don't render children (we're redirecting)
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  // User is not authenticated, show auth pages
  return <>{children}</>;
}

export default function AuthWithRedirect({ children }: AuthWithRedirectProps) {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    }>
      <AuthWithRedirectContent>{children}</AuthWithRedirectContent>
    </Suspense>
  );
}
