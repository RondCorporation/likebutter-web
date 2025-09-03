'use client';

import { useAuthStore } from '@/app/_stores/authStore';
import { User } from '@/app/_types/api';
import { LoaderCircle } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface AuthInitializerProps {
  children: ReactNode;
  preloadedUser: User | null;
  skipInitialization?: boolean;
  showLoader?: boolean;
}

export default function AuthInitializer({
  children,
  preloadedUser,
  skipInitialization = false,
  showLoader = true,
}: AuthInitializerProps) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const { initialize, logout, hydrate } = useAuthStore.getState();
  const effectRan = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || effectRan.current || skipInitialization) return;
    effectRan.current = true;

    if (preloadedUser) {
      hydrate(preloadedUser);
    } else {
      initialize();
    }

    const handleAuthFailure = () => {
      logout();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-failure', handleAuthFailure);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('auth-failure', handleAuthFailure);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, skipInitialization]);

  if (skipInitialization) {
    return <>{children}</>;
  }

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!isInitialized && showLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
