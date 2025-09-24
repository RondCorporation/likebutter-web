'use client';

import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/app/_components/Logo';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/_hooks/useAuth';
import UserDropdown from '@/app/_components/UserDropdown';

export default function MarketingHeader() {
  const { t, i18n } = useTranslation(['marketing', 'common']);
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const { isAuthenticated, isInitialized, isLoading, hasBasicInfo } = useAuth();

  const [hasTokenCookie, setHasTokenCookie] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';');
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('accessToken=')
      );
      const hasToken =
        accessTokenCookie && accessTokenCookie.split('=')[1]?.trim() !== '';
      setHasTokenCookie(!!hasToken);
    }
  }, []);

  const [isLangOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setLangOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLangChange = (newLang: string) => {
    setLangOpen(false);
    window.location.href = `/${newLang}`;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24" role="banner">
      {/* Top Bar */}
      <div className="bg-black text-white h-8">
        <div className="container mx-auto flex justify-end items-center px-4 sm:px-6 h-full text-sm">
          <div className="flex items-center gap-4">
            {/* Custom Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
                aria-haspopup="true"
                aria-expanded={isLangOpen}
              >
                <span>{i18n.language.toUpperCase()}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    isLangOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-32 bg-[#1A2B42] border border-white/10 rounded-lg shadow-lg z-10"
                  >
                    <button
                      onClick={() => handleLangChange('ko')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10"
                    >
                      {t('common:korean')}
                    </button>
                    <button
                      onClick={() => handleLangChange('en')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10"
                    >
                      {t('common:english')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Main Header */}
      <div className="bg-slate-800/20 backdrop-blur-sm border-b border-white/10 h-16">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-full">
          <div className="flex items-center gap-10">
            <Logo className="text-3xl" />
            <nav
              className="hidden md:flex gap-6"
              aria-label={t('mainNavigation')}
            >
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm hover:text-accent cursor-pointer"
              >
                {t('navServiceIntro')}
              </button>
              <button
                onClick={() => scrollToSection('demo')}
                className="text-sm hover:text-accent cursor-pointer"
              >
                {t('navLiveDemo')}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-sm hover:text-accent cursor-pointer"
              >
                {t('navPricing')}
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {(() => {
              if (isInitialized && isAuthenticated && hasBasicInfo) {
                return <UserDropdown />;
              }

              if (isInitialized && !isAuthenticated) {
                return (
                  <>
                    <Link
                      href={`/${lang}/login`}
                      className="hover:text-accent text-sm"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href={`/${lang}/signup`}
                      className="rounded-[16px] bg-transparent border border-[#FFD93B] px-5 py-2 text-sm font-bold text-[#FFD93B] transition-transform will-change-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 hover:bg-[#FFD93B] hover:text-black"
                    >
                      {t('signUp')}
                    </Link>
                  </>
                );
              }

              if (!isInitialized && hasTokenCookie) {
                return <div className="w-[120px] h-[32px]" />;
              }

              if (!isInitialized && hasTokenCookie === false) {
                return (
                  <>
                    <Link
                      href={`/${lang}/login`}
                      className="hover:text-accent text-sm"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      href={`/${lang}/signup`}
                      className="rounded-[16px] bg-transparent border border-[#FFD93B] px-5 py-2 text-sm font-bold text-[#FFD93B] transition-transform will-change-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400 hover:bg-[#FFD93B] hover:text-black"
                    >
                      {t('signUp')}
                    </Link>
                  </>
                );
              }

              return <div className="w-[120px] h-[32px]" />;
            })()}
          </div>
        </div>
      </div>
    </header>
  );
}
