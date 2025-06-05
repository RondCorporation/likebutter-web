'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import UserDropdown from './UserDropdown';
import Logo from './Logo'; // Logo 컴포넌트 임포트

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'demo', label: 'Demo' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState('about');
  const { token } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const handleNavClick = useCallback(
    (id: string) => {
      setActiveSection(id);
      // For scrolling to section if on homepage
      if (pathname === '/') {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [pathname]
  );

  useEffect(() => {
    setIsClient(true);

    if (pathname === '/') {
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
  }, [pathname]);

  // 현재 경로에 따른 UI 조건부 렌더링 로직
  const showNav = pathname === '/';
  const showAuthControls = !['/login', '/signup'].includes(pathname);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/30">
      <Logo /> {/* Logo 컴포넌트 사용 */}
      {showNav && (
        <nav className="hidden gap-6 md:flex">
          {NAV_ITEMS.map(({ id, label }) => (
            <Link
              key={id}
              href={`/#${id}`}
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
      {/* 로그인 또는 사용자 메뉴 버튼 */}
      {isClient &&
        showAuthControls &&
        (token ? (
          <UserDropdown />
        ) : (
          <Link
            href="/login"
            className="rounded-md border border-accent/40 px-4 py-1 text-sm text-accent transition hover:bg-accent/10"
          >
            Login
          </Link>
        ))}
      {!isClient && showAuthControls && (
        <div className="w-20 h-7 rounded-md border border-accent/40 bg-accent/5 animate-pulse" />
      )}
    </header>
  );
}
