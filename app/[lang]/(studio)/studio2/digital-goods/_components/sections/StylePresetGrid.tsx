'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StylePreset {
  name: string;
  width: number;
  selected?: boolean;
}

interface StylePresetGridProps {
  presets: StylePreset[];
  selectedPreset: string;
  onSelect: (presetName: string) => void;
}

const StylePresetGrid = memo(({ presets, selectedPreset, onSelect }: StylePresetGridProps) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current && canScrollLeft) {
      scrollContainerRef.current.scrollBy({
        left: -180,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && canScrollRight) {
      scrollContainerRef.current.scrollBy({
        left: 180,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollButtons();
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);

  const renderPresetRow = (presets: StylePreset[], startIndex: number) => (
    <div className="flex gap-3 flex-shrink-0">
      {presets.slice(startIndex, startIndex + 6).map((preset, index) => (
        <div
          key={startIndex + index}
          className="flex-col-center gap-1.5 cursor-pointer flex-shrink-0"
          onClick={() => onSelect(preset.name)}
        >
          <div
            className="relative h-[89px] bg-studio-content rounded-md overflow-hidden"
            style={{ width: `${preset.width}px` }}
          >
            <div className="w-full h-full bg-gradient-to-br from-studio-border to-studio-content" />
          </div>
          <div
            className={`font-pretendard-medium text-sm text-center leading-[19.6px] tracking-[0] ${
              preset.name === selectedPreset
                ? 'text-studio-button-hover'
                : 'text-studio-text-primary'
            }`}
            style={{ width: `${preset.width}px` }}
          >
            {preset.name}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden group">
      <div
        ref={scrollContainerRef}
        className="flex flex-col gap-2.5 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden [-webkit-scrollbar-width:none] [scrollbar-width:none]"
      >
        {renderPresetRow(presets, 0)}
        {presets.length > 6 && renderPresetRow(presets, 6)}
      </div>

      {/* Gradient Fade Effects */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
      )}
      {canScrollRight && (
        <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-studio-sidebar to-transparent pointer-events-none z-10 opacity-60" />
      )}

      {/* Scroll Controls */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20"
        >
          <ChevronLeft className="w-3 h-3 text-studio-text-primary" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 rounded-full opacity-0 group-hover:opacity-70 hover:opacity-100 bg-studio-sidebar/80 backdrop-blur-sm transition-all duration-300 z-20"
        >
          <ChevronRight className="w-3 h-3 text-studio-text-primary" />
        </button>
      )}
    </div>
  );
});

StylePresetGrid.displayName = 'StylePresetGrid';

export default StylePresetGrid;