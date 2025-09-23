'use client';

import { useEffect, ReactNode, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/app/_stores/authStore';
import { LoaderCircle } from 'lucide-react';

interface StudioAuthGuardProps {
  children: ReactNode;
}

function StudioAuthGuardContent({ children }: StudioAuthGuardProps) {
  const { isInitialized, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) {
      const segments = pathname.split('/');
      const lang = segments[1];
      const queryString = searchParams.toString();
      const currentUrl = pathname + (queryString ? `?${queryString}` : '');
      const returnToParam = encodeURIComponent(currentUrl);

      router.replace(`/${lang}/login?returnTo=${returnToParam}`);
    }
  }, [
    isInitialized,
    isLoading,
    isAuthenticated,
    router,
    pathname,
    searchParams,
  ]);

  if (!isInitialized || isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function StudioAuthGuard({ children }: StudioAuthGuardProps) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-black">
          <LoaderCircle size={40} className="animate-spin text-accent" />
        </div>
      }
    >
      <StudioAuthGuardContent>{children}</StudioAuthGuardContent>
    </Suspense>
  );
}
