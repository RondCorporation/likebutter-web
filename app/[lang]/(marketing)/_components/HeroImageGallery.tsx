'use client';

import { useState, useEffect, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface HeroImage {
  id: number;
  src: string;
  alt: string;
  column: number;
  row: number;
}

interface HeroImageGalleryProps {
  images?: HeroImage[];
  isVisible?: boolean;
  onAnimationComplete?: () => void;
}

export default function HeroImageGallery({
  images: customImages,
  isVisible = true,
  onAnimationComplete,
}: HeroImageGalleryProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isReady && isVisible && onAnimationComplete) {
      // Calculate the total animation time (last image delay + animation duration)
      const totalAnimationTime = (5 - 1) * 150 + 600; // (columns - 1) * delay + duration
      const timer = setTimeout(onAnimationComplete, totalAnimationTime);
      return () => clearTimeout(timer);
    }
  }, [isReady, isVisible, onAnimationComplete]);

  if (!isMounted) return null;

  const defaultImages: HeroImage[] = [
    {
      id: 1,
      src: '/hero-gallery/hero-1.png',
      alt: 'Hero Image 1',
      column: 1,
      row: 1,
    },
    {
      id: 2,
      src: '/hero-gallery/hero-2.png',
      alt: 'Hero Image 2',
      column: 1,
      row: 2,
    },
    {
      id: 3,
      src: '/hero-gallery/hero-3.png',
      alt: 'Hero Image 3',
      column: 2,
      row: 1,
    },
    {
      id: 4,
      src: '/hero-gallery/hero-4.png',
      alt: 'Hero Image 4',
      column: 3,
      row: 1,
    },
    {
      id: 5,
      src: '/hero-gallery/hero-5.png',
      alt: 'Hero Image 5',
      column: 4,
      row: 1,
    },
    {
      id: 6,
      src: '/hero-gallery/hero-6.png',
      alt: 'Hero Image 6',
      column: 5,
      row: 1,
    },
    {
      id: 7,
      src: '/hero-gallery/hero-7.png',
      alt: 'Hero Image 7',
      column: 5,
      row: 2,
    },
  ];

  const images = customImages || defaultImages;

  const getImagePosition = (column: number, row: number) => {
    const columnWidthWithGap = 330;
    const rowHeightWithGap = 430;
    const baseLeft = (column - 1) * columnWidthWithGap;
    let top = 0;
    switch (column) {
      case 1:
        top = (row - 1) * rowHeightWithGap;
        break;
      case 2:
        top = 200;
        break;
      case 3:
        top = 350;
        break;
      case 4:
        top = 200;
        break;
      case 5:
        top = (row - 1) * rowHeightWithGap;
        break;
    }
    return { left: baseLeft, top };
  };

  return (
    <div
      className="relative transition-opacity duration-300"
      style={{
        position: 'absolute',
        width: '1650px',
        height: '830px',
        left: '50%',
        transform: 'translateX(-810px)',
        opacity: isReady ? 1 : 0,
      }}
      suppressHydrationWarning
    >
      {images.map((image) => {
        const position = getImagePosition(image.column, image.row);
        const delay = (image.column - 1) * 0.15;
        return (
          <motion.div
            key={image.id}
            className="absolute"
            style={{ left: position.left, top: position.top }}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isReady && isVisible
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.6, delay: delay, ease: 'easeOut' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={400}
              className="w-[300px] h-[400px] object-cover shadow-2xl min-w-[300px] flex-shrink-0"
              style={{
                filter: 'brightness(0.7) contrast(1.1)',
                borderRadius: '20px',
              }}
              priority={image.id <= 6}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
