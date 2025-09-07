'use client';

import { useState, ReactNode, use } from 'react';
import StudioAuthGuard from '../_components/StudioAuthGuard';
import StudioSidebar from './_components/SidebarClient';
import StudioMainClient from './_components/StudioMainClient';
import { Menu } from 'lucide-react';

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default function StudioLayout({ children, params }: Props) {
  const { lang } = use(params);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <StudioAuthGuard>
      <div className="flex h-screen bg-black text-white relative">
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-40 h-full w-64 bg-black transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <StudioSidebar lang={lang} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header - This is part of the main content area now */}
          <header className="md:hidden flex h-[73px] flex-shrink-0 items-center justify-between border-b border-white/10 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-white"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            {/* UserDropdown might be needed here if it's not in StudioMainClient */}
          </header>

          {/* Pass children to StudioMainClient, which handles its own header for desktop */}
          <StudioMainClient lang={lang}>{children}</StudioMainClient>
        </div>
      </div>
    </StudioAuthGuard>
  );
}
