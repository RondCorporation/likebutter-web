'use client';

import { ReactNode } from 'react';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import AuthInitializer from '@/app/_components/AuthInitializer';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import { User } from '@/app/_types/api';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/app/_contexts/AuthContext';

export function LayoutClient({
  children,
  preloadedUser,
}: {
  children: ReactNode;
  preloadedUser: User | null;
}) {
  const pathname = usePathname();
  
  // Extract language and route segments
  const segments = pathname.split('/').filter(Boolean);
  const lang = segments[0];
  const routePath = segments.slice(1).join('/');
  
  // Define marketing routes that don't need auth
  const marketingRoutes = ['', 'pricing', 'privacy'];
  const authRoutes = ['login', 'signup'];
  const adminRoutes = ['admin'];
  const studioRoutes = ['studio', 'billing'];
  
  const isMarketingRoute = marketingRoutes.includes(routePath);
  const isAuthRoute = authRoutes.some(route => routePath.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => routePath.startsWith(route));
  const isStudioRoute = studioRoutes.some(route => routePath.startsWith(route));
  
  // Check if we're in a route group that has its own layout
  const hasRouteGroupLayout = isMarketingRoute || isAuthRoute || isAdminRoute || isStudioRoute;

  // If route groups handle their own auth, skip initialization here
  if (hasRouteGroupLayout) {
    return (
      <>
        <ServerErrorDisplay />
        <ConditionalSettingsModal />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow">{children}</main>
        </div>
      </>
    );
  }

  // Fallback for other routes
  return (
    <AuthProvider shouldInitializeAuth={true}>
      <AuthInitializer preloadedUser={preloadedUser}>
        <>
          <ServerErrorDisplay />
          <ConditionalSettingsModal />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </>
      </AuthInitializer>
    </AuthProvider>
  );
}
