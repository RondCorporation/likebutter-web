'use client';
import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoaderCircle } from 'lucide-react';

// AuthGuard only handles rendering, not redirects
// Redirects are handled by useAuth hook in parent components
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
    // If loading is complete but there is no user,
    // just show loading to prevent content flash while redirect is happening
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}
