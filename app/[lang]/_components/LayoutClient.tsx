'use client';

import { ReactNode, useMemo } from 'react';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import AuthInitializer from '@/app/_components/AuthInitializer';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import { User } from '@/app/_types/api';
import { usePathname } from 'next/navigation';
import { SWRProvider } from '@/app/_providers/SWRProvider';
import PerformanceMonitor from '@/app/_components/PerformanceMonitor';
import { PreloadPortoneProvider } from '@/components/portone/PreloadPortoneProvider';

export function LayoutClient({
  children,
  preloadedUser,
}: {
  children: ReactNode;
  preloadedUser: User | null;
}) {
  const pathname = usePathname();

  const routeInfo = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const lang = segments[0];
    const routePath = segments.slice(1).join('/');

    const marketingRoutes = ['', 'pricing', 'privacy'];
    const authRoutes = ['login', 'signup'];
    const adminRoutes = ['admin'];
    const studioRoutes = ['studio', 'billing'];

    const isMarketingRoute = marketingRoutes.includes(routePath);
    const isAuthRoute = authRoutes.some((route) => routePath.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) =>
      routePath.startsWith(route)
    );
    const isStudioRoute = studioRoutes.some((route) =>
      routePath.startsWith(route)
    );

    const hasRouteGroupLayout =
      isMarketingRoute || isAuthRoute || isAdminRoute || isStudioRoute;

    return {
      lang,
      routePath,
      isMarketingRoute,
      isAuthRoute,
      isAdminRoute,
      isStudioRoute,
      hasRouteGroupLayout,
    };
  }, [pathname]);

  if (routeInfo.hasRouteGroupLayout) {
    return (
      <SWRProvider>
        <PreloadPortoneProvider>
          <PerformanceMonitor />
          <ServerErrorDisplay />
          <ConditionalSettingsModal />
          {/* Studio 경로는 자체 layout에서 Toaster를 관리하므로 여기서는 제외 */}
          {!routeInfo.isStudioRoute && (
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          )}
          <div className="flex min-h-screen flex-col">
            <main className="flex-grow">{children}</main>
          </div>
        </PreloadPortoneProvider>
      </SWRProvider>
    );
  }

  return (
    <SWRProvider>
      <PreloadPortoneProvider>
        <PerformanceMonitor />
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
      </PreloadPortoneProvider>
    </SWRProvider>
  );
}
