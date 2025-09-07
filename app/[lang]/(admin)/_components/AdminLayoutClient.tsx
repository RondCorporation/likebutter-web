'use client';

import { ReactNode, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import '@/app/_lib/i18n-client';
import AuthInitializer from '@/app/_components/AuthInitializer';
import StudioAuthGuard from '@/app/[lang]/(studio)/_components/StudioAuthGuard';
import ServerErrorDisplay from '@/app/_components/shared/ServerErrorDisplay';
import ConditionalSettingsModal from '@/app/_components/ConditionalSettingsModal';
import AdminSidebar from '@/app/_components/admin/AdminSidebar';
import AdminMainContent from './AdminMainContent';

interface AdminLayoutClientProps {
  children: ReactNode;
}

export default function AdminLayoutClient({
  children,
}: AdminLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthInitializer
      preloadedUser={null}
      skipInitialization={false}
      showLoader={true}
    >
      <>
        <ServerErrorDisplay />
        <ConditionalSettingsModal />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #475569',
            },
          }}
        />
        <StudioAuthGuard>
          <div className="flex min-h-screen bg-black text-white">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } md:block`}
            >
              <AdminSidebar lang="ko" onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <AdminMainContent onSidebarToggle={() => setSidebarOpen(true)}>
                {children}
              </AdminMainContent>
            </div>
          </div>
        </StudioAuthGuard>
      </>
    </AuthInitializer>
  );
}
