'use client';

import { useAuthStore } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react'; // useRef 추가

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  // store에서 직접 함수를 가져옵니다.
  const initialize = useAuthStore.getState().initialize;
  const logout = useAuthStore.getState().logout;
  const effectRan = useRef(false); // 실행 여부를 추적할 ref

  useEffect(() => {
    // React 18의 StrictMode는 개발 환경에서 effect를 두 번 실행하므로,
    // 한 번만 실행되도록 ref로 방어합니다.
    if (effectRan.current) return;
    effectRan.current = true;

    initialize();

    const handleAuthFailure = () => {
      console.log('Auth failure event received. Logging out.');
      logout();
    };

    window.addEventListener('auth-failure', handleAuthFailure);

    return () => {
      window.removeEventListener('auth-failure', handleAuthFailure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열을 비워서 마운트 시 한 번만 실행되도록 합니다.

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}