'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import UserDropdown from './UserDropdown';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lang = pathname.split('/')[1];

  const handleLangChange = (newLang: string) => {
    const newPath = `/${newLang}${pathname.substring(`/${lang}`.length)}`;
    window.location.href = newPath;
  };

  return (
    <header className="w-full bg-[#001123] text-white">
      {/* Top bar */}
      <div className="bg-[#FFD93B] text-black">
        <div className="container mx-auto flex justify-end items-center px-4 sm:px-6 py-1 text-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                onChange={(e) => handleLangChange(e.target.value)}
                value={i18n.language}
                className="bg-transparent cursor-pointer"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
              </select>
            </div>
            <Link href="/customer-service" className="hover:underline">
              {t('customerCenter')}
            </Link>
            <Link href="/notices" className="hover:underline">
              {t('notices')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:flex gap-6">
              <Link href="/services" className="hover:text-accent">
                {t('navServices')}
              </Link>
              <Link href="/pricing" className="hover:text-accent">
                {t('navPricing')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isClient &&
              (isAuthenticated ? (
                <UserDropdown />
              ) : (
                <>
                  <Link href="/login" className="hover:text-accent text-sm">
                    {t('login')}
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
                  >
                    {t('signUp')}
                  </Link>
                </>
              ))}
            {!isClient && (
              <div className="w-32 h-8 rounded-md bg-gray-700 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
