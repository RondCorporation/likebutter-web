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
    // 스토어 초기화가 끝날 때까지 기다립니다.
    if (!isInitialized || isLoading) return;

    // 초기화 후, 인증 상태라면 리디렉션합니다.
    if (isAuthenticated) {
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
    }
  }, [isInitialized, isLoading, isAuthenticated, pathname, searchParams]);
  
  // 인증 상태 확인 중이거나, 리디렉션이 필요한 상태일 때 로더를 보여줍니다.
  if (!isInitialized || isLoading || isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }
  
  // 인증되지 않았음이 확실할 때만 로그인/회원가입 폼을 보여줍니다.
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
