'use client';

import { useTranslation } from 'react-i18next';
import { Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/app/_components/Logo';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketingHeader() {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
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

  const supportMenuItems = [
    { label: t('customerCenter'), href: `/${lang}/support` },
    { label: t('faq'), href: `/${lang}/faq` },
    { label: t('notices'), href: `/${lang}/notices` },
    { label: t('termsOfService'), href: `/${lang}/terms` },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24" role="banner">
      {/* Top Bar */}
      <div className="bg-slate-900/50 text-white h-8">
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
                      한국어
                    </button>
                    <button
                      onClick={() => handleLangChange('en')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10"
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* New Support Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="p-1 hover:bg-white/10 rounded-full"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                aria-label={t('supportAndNotices')}
              >
                <Menu size={16} />
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#1A2B42] border border-white/10 rounded-lg shadow-lg z-10 py-1"
                  >
                    {supportMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                      >
                        {item.label}
                      </Link>
                    ))}
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
              <Link href="#" className="text-sm hover:text-accent">
                {t('navServices')}
              </Link>
              <Link
                href={`/${lang}/pricing`}
                className="text-sm hover:text-accent"
              >
                {t('navPricing')}
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/login`}
              className="hover:text-accent text-sm"
            >
              {t('login')}
            </Link>
            <Link
              href={`/${lang}/signup`}
              className="rounded-full bg-[#FFD93B] px-5 py-2 text-sm font-bold text-black transition-transform will-change-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
            >
              {t('signUp')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
