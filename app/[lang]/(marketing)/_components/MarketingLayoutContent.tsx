'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import MarketingHeader from './MarketingHeader';
import MarketingFooter from './MarketingFooter';
import { ScrollContext } from '../_context/ScrollContext';

interface MarketingLayoutContentProps {
  children: ReactNode;
}

export default function MarketingLayoutContent({ 
  children 
}: MarketingLayoutContentProps) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const isLandingPage = pathname === `/${lang}`;

  if (isLandingPage) {
    return (
      <ScrollContext.Provider value={{ sectionRefs }}>
        <MarketingHeader />
        <div
          className="bg-black text-white"
        >
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

  // Default layout for other marketing pages like /privacy
  return (
    <div className="bg-black text-white">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}