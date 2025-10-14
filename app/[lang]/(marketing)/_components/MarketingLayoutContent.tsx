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
        <div className="flex flex-col h-screen w-full overflow-hidden">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header variant="marketing" />
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto bg-black text-white pt-16"
            style={{
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
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
        </div>
      </ScrollContext.Provider>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header variant="marketing" />
      </div>

      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto bg-black text-white pt-16"
        style={{
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
        }}
      >
        <main>{children}</main>
        <MarketingFooter />
      </div>
    </div>
  );
}
