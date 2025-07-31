'use client';

import { useAuthStore, User } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';

export default function AuthInitializer({
  children,
  preloadedUser,
}: {
  children: ReactNode;
  preloadedUser: User | null;
}) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const { initialize, logout, hydrate } = useAuthStore.getState();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    if (preloadedUser) {
      hydrate(preloadedUser);
    } else {
      initialize();
    }

    const handleAuthFailure = () => {
      console.log('Auth failure event received. Logging out.');
      logout();
    };

    window.addEventListener('auth-failure', handleAuthFailure);

    return () => {
      window.removeEventListener('auth-failure', handleAuthFailure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
