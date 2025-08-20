'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MarketingHeader from './_components/MarketingHeader';
import MarketingFooter from './_components/MarketingFooter';
import ScrollIndicator from '@/app/_components/ScrollIndicator';
import { ScrollContext } from './_context/ScrollContext';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const isLandingPage = pathname === `/${lang}`;

  useEffect(() => {
    if (!isLandingPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-section-index') || '0',
              10
            );
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRefs = sectionRefs.current.filter(
      (ref) => ref !== null
    ) as HTMLElement[];
    currentRefs.forEach((ref) => observer.observe(ref));

    return () => {
      currentRefs.forEach((ref) => observer.unobserve(ref));
    };
  }, [children, isLandingPage]);

  if (isLandingPage) {
    return (
      <ScrollContext.Provider value={{ sectionRefs }}>
        <MarketingHeader />
        <ScrollIndicator count={5} activeIndex={activeIndex} />
        <div
          className="bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end text-white h-screen snap-y snap-mandatory overflow-y-scroll overscroll-contain"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
          <MarketingFooter
            ref={(el) => (sectionRefs.current[4] = el)}
            data-section-index={4}
            isSnapSection={true}
          />
        </div>
      </ScrollContext.Provider>
    );
  }

  // Default layout for other marketing pages like /privacy
  return (
    <div className="bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end text-white">
      <MarketingHeader />
      <main>{children}</main>
      <MarketingFooter />
    </div>
  );
}
