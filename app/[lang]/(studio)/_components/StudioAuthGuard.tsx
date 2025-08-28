'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/app/_stores/authStore';
import { getMe } from '@/app/_lib/apis/user.api';
import { LoaderCircle } from 'lucide-react';

interface StudioAuthGuardProps {
  children: ReactNode;
}

export default function StudioAuthGuard({ children }: StudioAuthGuardProps) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [authVerified, setAuthVerified] = useState(false);
  const { user, isInitialized, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Direct API verification when entering studio routes
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data: userData } = await getMe();
        if (userData) {
          // Sync with store if needed
          if (!user || user.accountId !== userData.accountId) {
            setUser(userData);
          }
          setAuthVerified(true);
        } else {
          // No user data, redirect to login
          const segments = pathname.split('/');
          const lang = segments[1];
          const returnToParam = encodeURIComponent(pathname);
          router.replace(`/${lang}/login?returnTo=${returnToParam}`);
          return;
        }
      } catch (error) {
        // API call failed, user is not authenticated
        const segments = pathname.split('/');
        const lang = segments[1];
        const returnToParam = encodeURIComponent(pathname);
        router.replace(`/${lang}/login?returnTo=${returnToParam}`);
        return;
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [pathname, router, user, setUser]);

  // Show loading during verification
  if (isVerifying) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  // After verification, use state-based guard for subsequent renders
  if (!authVerified || !isInitialized || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  return <>{children}</>;
}