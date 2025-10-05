'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/app/_components/Header';
import MarketingFooter from './MarketingFooter';
import { ScrollContext } from '../_context/ScrollContext';

interface MarketingLayoutContentProps {
  children: ReactNode;
}

export default function MarketingLayoutContent({
  children,
}: MarketingLayoutContentProps) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const isLandingPage = pathname === `/${lang}`;

  if (isLandingPage) {
    return (
      <ScrollContext.Provider value={{ sectionRefs }}>
        <Header variant="marketing" />
        <div className="bg-black text-white">
          {children}
          <MarketingFooter
            ref={(el) => {
              sectionRefs.current[4] = el;
            }}
            data-section-index={4}
            isSnapSection={true}
          />
        </div>
      </ScrollContext.Provider>
    );
  }

  return (
    <div className="bg-black text-white">
      <Header variant="marketing" />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
