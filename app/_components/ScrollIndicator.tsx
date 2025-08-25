'use client';

import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  count: number;
  activeIndex: number;
}

export default function ScrollIndicator({ count, activeIndex }: ScrollIndicatorProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 p-2 rounded-full bg-black/20 backdrop-blur-sm">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative w-3 h-3 flex items-center justify-center">
          <div
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
              activeIndex === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
          {activeIndex === index && (
            <motion.div
              layoutId="active-indicator"
              className="absolute w-full h-full rounded-full border-2 border-white"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
