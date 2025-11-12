'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AIStyle {
  id: string;
  title: string;
  image: string;
  route: string;
  styleParam?: string;
}

interface NewAIStylesSectionProps {
  styles: AIStyle[];
}

export default function NewAIStylesSection({
  styles,
}: NewAIStylesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleStyleClick = (route: string, styleParam?: string) => {
    const toolName = route.split('/').pop();
    const lang = pathname.split('/')[1];
    const queryParams = new URLSearchParams();
    queryParams.set('tool', toolName || '');
    if (styleParam) {
      queryParams.set('style', styleParam);
    }
    const url = `/${lang}/studio?${queryParams.toString()}`;
    router.push(url);
  };

  return (
    <div className="relative">
      <h3 className="text-white font-semibold text-lg mb-4">
        새로운 AI스타일 업데이트
      </h3>

      {/* Desktop: Grid with 5 columns */}
      <div className="hidden md:grid grid-cols-5 gap-4">
        {styles.map((style) => (
          <div
            key={style.id}
            onClick={() => handleStyleClick(style.route, style.styleParam)}
            className="cursor-pointer group/card"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
              <Image
                src={style.image}
                alt={style.title}
                fill
                className="object-cover group-hover/card:scale-110 transition-transform"
                sizes="(min-width: 768px) 20vw"
              />
            </div>
            <h4 className="text-white text-sm font-medium text-center">
              {style.title}
            </h4>
          </div>
        ))}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="block md:hidden relative group">
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {styles.map((style) => (
            <div
              key={style.id}
              onClick={() => handleStyleClick(style.route, style.styleParam)}
              className="flex-shrink-0 w-48 cursor-pointer group/card"
            >
              <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                <Image
                  src={style.image}
                  alt={style.title}
                  fill
                  className="object-cover group-hover/card:scale-110 transition-transform"
                  sizes="192px"
                />
              </div>
              <h4 className="text-white text-sm font-medium text-center">
                {style.title}
              </h4>
            </div>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
