'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  User,
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  LayoutGrid,
  History,
} from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';
import { useAuthUser } from '@/hooks/useAuthStore';
import { useOpenSettings } from '@/hooks/useUIStore';

export default function UserDropdown() {
  const user = useAuthUser();
  const logout = useLogout();
  const openSettings = useOpenSettings();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const lang = pathname.split('/')[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  if (!user) return null;

  const handleAction = (action: () => void | Promise<void>) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-accent/40 px-4 py-1 text-sm text-accent transition hover:bg-accent/10"
      >
        <User size={16} />
        <span>{user.name}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-neutral-900 border border-white/10 shadow-lg py-1 z-50 animate-fadeIn">
          <Link
            href={`/${lang}/studio`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition"
          >
            <LayoutGrid size={16} /> {t('dropdownStudio')}
          </Link>
          <Link
            href={`/${lang}/billing`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition"
          >
            <CreditCard size={16} /> {t('dropdownSubscription')}
          </Link>
          <Link
            href={`/${lang}/billing/history`}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition"
          >
            <History size={16} /> {t('dropdownPaymentHistory')}
          </Link>
          <button
            onClick={() => handleAction(() => openSettings())}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 transition"
          >
            <Settings size={16} /> {t('dropdownSettings')}
          </button>
          <hr className="border-white/10 my-1" />
          <button
            onClick={() => handleAction(logout)}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition"
          >
            <LogOut size={16} /> {t('dropdownLogout')}
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
