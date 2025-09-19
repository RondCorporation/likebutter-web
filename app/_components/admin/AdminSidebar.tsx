'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  CreditCard,
  List,
  User,
  Shield,
  Settings,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Logo from '@/components/Logo';

interface AdminSidebarProps {
  lang: string;
  onClose: () => void;
}

export default function AdminSidebar({ lang, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'dashboard',
  ]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionKey)
        ? prev.filter((key) => key !== sectionKey)
        : [...prev, sectionKey]
    );
  };

  const handleLinkClick = () => {
    onClose();
  };

  const navigation = [
    {
      key: 'dashboard',
      name: '대시보드',
      href: `/${lang}/admin`,
      icon: BarChart3,
      exact: true,
    },
    {
      key: 'users',
      name: '사용자 관리',
      icon: Users,
      children: [
        {
          name: '전체 사용자',
          href: `/${lang}/admin/users`,
          icon: User,
        },
        {
          name: '계정 관리',
          href: `/${lang}/admin/accounts`,
          icon: Shield,
        },
      ],
    },
    {
      key: 'billing',
      name: '결제 관리',
      icon: CreditCard,
      children: [
        {
          name: '구독 관리',
          href: `/${lang}/admin/subscriptions`,
          icon: CreditCard,
        },
        {
          name: '결제 내역',
          href: `/${lang}/admin/payments`,
          icon: List,
        },
      ],
    },
    {
      key: 'system',
      name: '시스템',
      icon: Settings,
      children: [
        {
          name: '작업 관리',
          href: `/${lang}/admin/tasks`,
          icon: List,
        },
      ],
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-full w-64 flex-col gap-1 overflow-y-auto border-r border-slate-700 bg-slate-900 p-4 pt-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-2 py-1">
        <Link href={`/${lang}`} onClick={handleLinkClick}>
          <Logo className="text-2xl" />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden text-slate-300 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Admin Badge */}
      <div className="mb-6 px-2">
        <div className="rounded-lg bg-blue-500/20 border border-blue-400/30 p-3 text-center">
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <Shield size={16} />
            <span className="text-sm font-semibold">관리자 모드</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedSections.includes(item.key);
            return (
              <div key={item.key}>
                <button
                  onClick={() => toggleSection(item.key)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={handleLinkClick}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-800 ${
                          isActive(child.href)
                            ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <child.icon size={16} />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.key}
              href={item.href!}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-slate-800 ${
                isActive(item.href!, item.exact)
                  ? 'bg-blue-500/20 font-semibold text-blue-400 border-l-2 border-blue-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
