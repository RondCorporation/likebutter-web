'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import UserDropdown from './UserDropdown';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [activeSection, setActiveSection] = useState('about');
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { id: 'about', label: t('navAbout') },
    { id: 'features', label: t('navFeatures') },
    { id: 'demo', label: t('navDemo') },
    { id: 'pricing', label: t('navPricing') },
    { id: 'contact', label: t('navContact') },
  ];

  const lang = pathname.split('/')[1];

  const handleNavClick = useCallback(
    (id: string) => {
      setActiveSection(id);
      if (pathname === `/${lang}/`) {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      setIsMobileMenuOpen(false); // Close mobile menu on navigation
    },
    [pathname, lang]
  );

  useEffect(() => {
    setIsClient(true);

    if (pathname === `/${lang}/`) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(entry.target.id);
          });
        },
        {
          rootMargin: '-40% 0px -40% 0px',
          threshold: 0.1,
        }
      );

      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    }
  }, [pathname, lang]);

  useEffect(() => {
    // Disable body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const showNav = pathname === `/${lang}/` || pathname === '/';
  const showAuthControls =
    !pathname.includes('/login') && !pathname.includes('/signup');

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-md bg-black/30">
      <Logo />

      {/* Desktop Navigation */}
      {showNav && (
        <nav className="hidden gap-6 md:flex">
          {NAV_ITEMS.map(({ id, label }) => (
            <Link
              key={id}
              href={`#${id}`}
              onClick={() => handleNavClick(id)}
              className={`relative transition-all ${
                activeSection === id
                  ? 'text-sm md:text-base text-accent scale-102'
                  : 'text-sm text-slate-200 hover:text-accent'
              }`}
            >
              {label}
              {activeSection === id && (
                <span className="absolute left-1/2 top-full mt-1 block h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-4">
        {/* Auth Controls */}
        {isClient &&
          showAuthControls &&
          (isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Link
              href="/login"
              className="hidden sm:block rounded-md border border-accent/40 px-4 py-1 text-sm text-accent transition hover:bg-accent/10"
            >
              {t('login')}
            </Link>
          ))}
        {!isClient && showAuthControls && (
          <div className="w-20 h-7 rounded-md border border-accent/40 bg-accent/5 animate-pulse" />
        )}

        {/* Mobile Menu Button */}
        {showNav && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && showNav && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-700">
            <Logo />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center gap-8 mt-16">
            {NAV_ITEMS.map(({ id, label }) => (
              <Link
                key={id}
                href={`#${id}`}
                onClick={() => handleNavClick(id)}
                className={`text-2xl transition-colors ${
                  activeSection === id ? 'text-accent' : 'text-slate-200'
                }`}
              >
                {label}
              </Link>
            ))}
            {/* Mobile Auth Button */}
            {!isAuthenticated && showAuthControls && (
               <Link
                  href="/login"
                  className="sm:hidden rounded-md border border-accent/40 px-6 py-2 text-lg text-accent transition hover:bg-accent/10"
                >
                  {t('login')}
                </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
