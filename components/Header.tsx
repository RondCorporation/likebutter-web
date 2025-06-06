'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import UserDropdown from './UserDropdown';
import Logo from './Logo';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from 'next-intl/client'; // Note: using next-intl's Link

const NAV_DEFINITIONS = [
  { id: 'about', translationKey: 'About' },
  { id: 'features', translationKey: 'Features' },
  { id: 'demo', translationKey: 'Demo' },
  { id: 'pricing', translationKey: 'Pricing' },
  { id: 'contact', translationKey: 'Contact' },
];

export default function Header() {
  const t = useTranslations('Header');
  const currentLocale = useLocale();
  const router = useRouter();
  const currentPathname = usePathname(); // Pathname without locale

  const [activeSection, setActiveSection] = useState('about');
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const handleNavClick = useCallback(
    (id: string) => {
      setActiveSection(id);
      // currentPathname from next-intl/client is already without locale
      if (currentPathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [currentPathname]
  );

  useEffect(() => {
    setIsClient(true);

    // currentPathname from next-intl/client is already without locale
    if (currentPathname === '/') {
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

      NAV_DEFINITIONS.forEach(({ id }) => { // Use NAV_DEFINITIONS
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    }
  }, [currentPathname]);

  const switchLanguage = (newLocale: string) => {
    router.replace(currentPathname, { locale: newLocale, scroll: false });
  };

  const showNav = currentPathname === '/';
  // currentPathname from next-intl/client is already without locale
  const showAuthControls = !['/login', '/signup'].includes(currentPathname);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30">
      <Logo />
      <div className="flex items-center">
        {showNav && (
          <nav className="hidden gap-6 md:flex">
            {NAV_DEFINITIONS.map(({ id, translationKey }) => (
              <Link
                key={id}
                href={`/#${id}`} // Stays same, next-intl Link handles locale if needed, but for hash it's fine
                onClick={() => handleNavClick(id)}
                className={`relative transition-all ${
                  activeSection === id
                    ? 'text-sm md:text-base text-accent scale-102'
                    : 'text-sm text-slate-200 hover:text-accent'
                }`}
              >
                {t(translationKey)}
                {activeSection === id && (
                  <span className="absolute left-1/2 top-full mt-1 block h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Language Switcher */}
        <div className="flex items-center gap-1 ml-6">
          {(['en', 'ko'] as const).map((lang) => (
            <button
              key={lang}
              disabled={currentLocale === lang}
              onClick={() => switchLanguage(lang)}
              className={`px-2 py-1 text-xs rounded-md transition-colors
                ${currentLocale === lang
                  ? 'font-semibold text-accent cursor-default'
                  : 'text-slate-300 hover:text-accent hover:bg-white/5'
                }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 로그인 또는 사용자 메뉴 버튼 */}
        <div className="ml-4"> {/* Added margin for separation */}
          {isClient &&
            showAuthControls &&
            (token ? (
              <UserDropdown />
            ) : (
              <Link
                href="/login" // next-intl Link will handle locale
                className="rounded-md border border-accent/40 px-4 py-1 text-sm text-accent transition hover:bg-accent/10"
              >
                {t('Login')}
              </Link>
            ))}
          {!isClient && showAuthControls && (
            <div className="w-20 h-7 rounded-md border border-accent/40 bg-accent/5 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
}
