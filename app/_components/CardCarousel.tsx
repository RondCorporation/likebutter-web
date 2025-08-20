'use client';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = { title: string; gradient: string };

export default function CardCarousel({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false); // Ref to prevent rapid transitions

  // Create a "looped" slide deck for seamless scrolling
  const extendedSlides = useMemo(() => {
    if (slides.length === 0) return [];
    const first = slides[0];
    const last = slides[slides.length - 1];
    return [last, ...slides, first];
  }, [slides]);

  const scrollToCard = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (card) {
      track.scrollTo({
        left: card.offsetLeft - (track.offsetWidth - card.offsetWidth) / 2,
        behavior,
      });
    }
  }, []);

  // Set initial position to the first "real" slide without animation
  useEffect(() => {
    setTimeout(() => {
      scrollToCard(1, 'auto');
    }, 10);
  }, [scrollToCard, slides]);

  const handleNav = (direction: 'prev' | 'next') => {
    if (isTransitioning.current) return;

    const newIndex = direction === 'prev' ? activeIndex - 1 + 1 : activeIndex + 1 + 1;
    setActiveIndex((prev) => (direction === 'prev' ? (prev - 1 + slides.length) % slides.length : (prev + 1) % slides.length));
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

  // Use Intersection Observer to update active index on user scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const realIndex = parseInt(entry.target.getAttribute('data-real-index')!, 10);
            setActiveIndex(realIndex);
          }
        });
      },
      { root: track, threshold: 0.7 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [slides.length, extendedSlides.length]);

  // Handle the scroll "snap" back for infinite loop effect
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
        
        // Check if scrolled to the first clone (the last item)
        if (scrollLeft < cardWidth / 2) {
          isTransitioning.current = true;
          scrollToCard(slides.length, 'auto');
          setTimeout(() => { isTransitioning.current = false; }, 50);
        }
        // Check if scrolled to the last clone (the first item)
        else if (scrollLeft > (cardWidth + gap) * slides.length - cardWidth / 2) {
          isTransitioning.current = true;
          scrollToCard(1, 'auto');
          setTimeout(() => { isTransitioning.current = false; }, 50);
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
          // This padding shows the peeking cards on the edges
          paddingLeft: 'calc(50% - (88% / 2))',
          paddingRight: 'calc(50% - (88% / 2))',
        }}
        aria-live="polite"
      >
        {extendedSlides.map((slide, i) => {
          const realIndex = i - 1 < 0 ? slides.length - 1 : (i - 1) % slides.length;
          const isActive = activeIndex === realIndex;

          return (
            <div
              key={i}
              data-real-index={realIndex}
              className={`snap-center flex-shrink-0 basis-[88%] sm:basis-[72%] lg:basis-[66%] xl:basis-[58%] h-[65vh] bg-gradient-to-br ${slide.gradient} rounded-3xl shadow-2xl grid place-items-center text-white transition-all duration-500 ease-out mx-2`}
              style={{
                opacity: isActive ? 1 : 0.5,
                transform: `translateY(${isActive ? 0 : '1.5rem'})`,
              }}
              role="group"
              aria-label={`${realIndex + 1} / ${slides.length}`}
            >
              <span className="text-3xl md:text-4xl font-bold">{slide.title}</span>
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
