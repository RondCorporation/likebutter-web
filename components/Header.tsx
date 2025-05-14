'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'features', label: 'Features' },
  { id: 'demo', label: 'Demo' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

export default function Header() {
  const [active, setActive] = useState('about');
  const handleClick = useCallback((id: string) => setActive(id), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1,
      },
    );

    NAV.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md">
      <h1 className="text-lg font-bold text-white">ROND</h1>

      <nav className="hidden gap-6 md:flex">
        {NAV.map(({ id, label }) => (
          <Link
            key={id}
            href={`#${id}`}
            onClick={() => handleClick(id)}
            className={`relative transition-all
                ${
                  active === id
                    ? 'text-sm md:text-base text-white scale-102'
                    : 'text-sm  text-slate-200 hover:text-white'
                }`}
          >
            {label}
            {active === id && (
              <span className="absolute left-1/2 top-full mt-1 block h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
            )}
          </Link>
        ))}
      </nav>

      <Link
        href="/login"
        className="rounded-md border border-white/30 px-4 py-1 text-sm text-white transition hover:bg-white/10"
      >
        Login
      </Link>
    </header>
  );
}
