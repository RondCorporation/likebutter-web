'use client';
import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading, isInitialized } = useAuthStore();

  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
