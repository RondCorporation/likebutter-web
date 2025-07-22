'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
