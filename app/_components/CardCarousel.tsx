'use client';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  title: string;
  subtitle?: string;
  gradient: string;
  icon?: string;
};

export default function CardCarousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false); // Ref to prevent rapid transitions

  const extendedSlides = useMemo(() => {
    if (slides.length === 0) return [];
    const first = slides[0];
    const last = slides[slides.length - 1];
    return [last, ...slides, first];
  }, [slides]);

  const scrollToCard = useCallback(
    (index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.children[index] as HTMLElement;
      if (card) {
        track.scrollTo({
          left: card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2,
          behavior,
        });
      }
    },
    []
  );

  useEffect(() => {
    setTimeout(() => {
      scrollToCard(1, 'auto');
    }, 10);
  }, [scrollToCard, slides]);

  const handleNav = (direction: 'prev' | 'next') => {
    if (isTransitioning.current) return;

    const newIndex =
      direction === 'prev' ? activeIndex - 1 + 1 : activeIndex + 1 + 1;
    setActiveIndex((prev) =>
      direction === 'prev'
        ? (prev - 1 + slides.length) % slides.length
        : (prev + 1) % slides.length
    );
    scrollToCard(newIndex);

    isTransitioning.current = true;
    setTimeout(() => {
      if (newIndex === 0) {
        setActiveIndex(slides.length - 1);
        scrollToCard(slides.length, 'auto');
      } else if (newIndex === extendedSlides.length - 1) {
        setActiveIndex(0);
        scrollToCard(1, 'auto');
      }
      isTransitioning.current = false;
    }, 500); // Corresponds to the CSS transition duration
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const realIndex = parseInt(
              entry.target.getAttribute('data-real-index')!,
              10
            );
            setActiveIndex(realIndex);
          }
        });
      },
      { root: track, threshold: 0.7 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [slides.length, extendedSlides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (isTransitioning.current) return;

        const scrollLeft = track.scrollLeft;
        const cardWidth = (track.children[1] as HTMLElement).offsetWidth;
        const gap = 16; // Assuming gap-4 -> 1rem -> 16px

        if (scrollLeft < cardWidth / 2) {
          isTransitioning.current = true;
          scrollToCard(slides.length, 'auto');
          setTimeout(() => {
            isTransitioning.current = false;
          }, 50);
        } else if (
          scrollLeft >
          (cardWidth + gap) * slides.length - cardWidth / 2
        ) {
          isTransitioning.current = true;
          scrollToCard(1, 'auto');
          setTimeout(() => {
            isTransitioning.current = false;
          }, 50);
        }
      }, 150);
    };

    track.addEventListener('scroll', handleScroll);
    return () => track.removeEventListener('scroll', handleScroll);
  }, [slides.length, scrollToCard]);

  return (
    <div className="relative w-full" aria-roledescription="carousel">
      <div
        ref={trackRef}
        className="flex items-center overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-10"
        style={{
          paddingLeft: 'calc(50% - (88% / 2))',
          paddingRight: 'calc(50% - (88% / 2))',
        }}
        aria-live="polite"
      >
        {extendedSlides.map((slide, i) => {
          const realIndex =
            i - 1 < 0 ? slides.length - 1 : (i - 1) % slides.length;
          const isActive = activeIndex === realIndex;

          return (
            <div
              key={i}
              data-real-index={realIndex}
              className={`snap-center flex-shrink-0 basis-[88%] sm:basis-[72%] lg:basis-[66%] xl:basis-[58%] h-[65vh] bg-gradient-to-br ${slide.gradient} rounded-3xl shadow-2xl grid place-items-center text-white transition-all duration-500 ease-out mx-2 relative overflow-hidden`}
              style={{
                opacity: isActive ? 1 : 0.7,
                transform: `translateY(${isActive ? 0 : '1.5rem'}) rotateY(${isActive ? 0 : '5deg'}) scale(${isActive ? 1 : 0.95})`,
                transformStyle: 'preserve-3d',
              }}
              role="group"
              aria-label={`${realIndex + 1} / ${slides.length}`}
            >
              {/* Glass morphism overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

              {/* Animated background elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: '1s' }}
              ></div>

              <div className="text-center px-8 relative z-10">
                {slide.icon && (
                  <div className="text-6xl md:text-7xl mb-6 transform hover:scale-110 transition-transform duration-300 animate-bounce-subtle">
                    {slide.icon}
                  </div>
                )}
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-white bg-clip-text text-transparent drop-shadow-lg">
                  {slide.title}
                </h3>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-md mx-auto font-medium">
                    {slide.subtitle}
                  </p>
                )}
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full animate-shimmer"></div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleNav('prev')}
          className="rounded-full p-3 bg-white/30 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => handleNav('next')}
          className="rounded-full p-3 bg-white/30 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
