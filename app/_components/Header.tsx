'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import UserDropdown from './UserDropdown';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { Menu, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isClient, setIsClient] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // This is for a potential future menu dropdown from the header, not the side sheet
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const lang = pathname.split('/')[1];

  const handleLangChange = (newLang: string) => {
    setLangOpen(false);
    const newPath = `/${newLang}${pathname.substring(`/${lang}`.length)}`;
    window.location.href = newPath;
  };

  const supportMenuItems = [
    { label: t('customerCenter'), href: `/${lang}/support` },
    { label: t('faq'), href: `/${lang}/faq` },
    { label: t('notices'), href: `/${lang}/notices` },
    { label: t('termsOfService'), href: `/${lang}/terms` },
  ];

  return (
    <>
      <header className="w-full bg-[#001123] text-white" role="banner">
        {/* Top bar */}
        <div className="bg-[#0A192F]/50 border-b border-white/10">
          <div className="container mx-auto flex justify-end items-center px-4 sm:px-6 h-10 text-sm">
            <div className="flex items-center gap-4">
              {/* Custom Language Dropdown */}
              <div className="relative" ref={langRef}>
                <button
                  onClick={() => setLangOpen(!isLangOpen)}
                  className="flex items-center gap-1 px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={isLangOpen}
                >
                  <span>{i18n.language.toUpperCase()}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isLangOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-32 bg-[#1A2B42] border border-white/10 rounded-lg shadow-lg z-10"
                    >
                      <button onClick={() => handleLangChange('ko')} className="w-full text-left px-4 py-2 hover:bg-white/10">한국어</button>
                      <button onClick={() => handleLangChange('en')} className="w-full text-left px-4 py-2 hover:bg-white/10">English</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Support Menu Trigger */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full"
                aria-label={t('supportAndNotices')}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="border-b border-white/10">
          <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 py-3">
            <div className="flex items-center gap-8">
              <Logo />
              <nav className="hidden md:flex gap-6" aria-label={t('mainNavigation')}>
                <Link href={`/${lang}/services`} className="hover:text-accent">{t('navServices')}</Link>
                <Link href={`/${lang}/pricing`} className="hover:text-accent">{t('navPricing')}</Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {isClient ? (
                isAuthenticated ? (
                  <UserDropdown />
                ) : (
                  <>
                    <Link href={`/${lang}/login`} className="hover:text-accent text-sm">{t('login')}</Link>
                    <Link
                      href={`/${lang}/signup`}
                      className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black transition-transform will-change-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {t('signUp')}
                    </Link>
                  </>
                )
              ) : (
                <div className="w-32 h-8 rounded-md bg-gray-700 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Support Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 bg-[#0A192F] shadow-2xl z-50 p-6 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-menu-title"
            >
              <div className="flex justify-between items-center">
                <h2 id="support-menu-title" className="text-lg font-semibold">{t('support')}</h2>
                <button onClick={() => setMenuOpen(false)} className="p-1 rounded-full hover:bg-white/10">
                  <X size={24} />
                  <span className="sr-only">{t('closeMenu')}</span>
                </button>
              </div>
              <nav className="mt-8 flex flex-col gap-4">
                {supportMenuItems.map((item) => (
                  <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="px-4 py-3 rounded-md hover:bg-white/10 transition-colors text-lg">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
