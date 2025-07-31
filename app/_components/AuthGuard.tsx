'use client';
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoaderCircle } from 'lucide-react';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  if (!user) {
    // If loading is complete but there is no user,
    // the useAuth hook is already handling the redirect.
    // Return null to prevent flashing the protected content.
    return null;
  }

  return <>{children}</>;
}
