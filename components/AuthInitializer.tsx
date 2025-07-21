'use client';

import { useAuthStore } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function AuthInitializer({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
