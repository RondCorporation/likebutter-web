'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Shield } from 'lucide-react';
import UserDropdown from '@/components/UserDropdown';

interface AdminMainContentProps {
  children: ReactNode;
  onSidebarToggle: () => void;
}

export default function AdminMainContent({
  children,
  onSidebarToggle,
}: AdminMainContentProps) {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    const PAGE_TITLES: { [key: string]: string } = {
      '/admin': '대시보드',
      '/admin/users': '전체 사용자',
      '/admin/accounts': '계정 관리',
      '/admin/subscriptions': '구독 관리',
      '/admin/payments': '결제 내역',
      '/admin/tasks': '작업 관리',
    };

    // Remove language prefix and find matching title
    const pathWithoutLang = pathname.replace(/^\/[a-z]{2}/, '');
    return PAGE_TITLES[pathWithoutLang] || '관리자';
  }, [pathname]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-700 bg-slate-900/50 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onSidebarToggle}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/20 p-2">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-xl font-semibold text-white">{pageTitle}</h1>
          </div>
        </div>

        <UserDropdown />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black/50 p-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
