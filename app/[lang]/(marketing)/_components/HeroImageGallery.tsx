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
  sectionId?: number;
}

export default function HeroImageGallery({
  images: customImages,
  isVisible = true,
  onAnimationComplete,
  sectionId,
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
      const totalAnimationTime = (5 - 1) * 150 + 600;
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

  const mobileImages = images.filter((img) => img.id !== 7);

  // Special handling for Idol Cover section (sectionId === 2)
  const isIdolCoverSection = sectionId === 2;

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

    // Add offset for non-Idol Cover sections to maintain original position
    const offsetTop = isIdolCoverSection ? top : top + 317;
    return { left: baseLeft, top: offsetTop };
  };

  const getMobileImagePosition = (column: number, row: number) => {
    const columnWidthWithGap = 280;
    const rowHeightWithGap = 360;
    const baseLeft = (column - 1) * columnWidthWithGap;
    let top = (row - 1) * rowHeightWithGap;

    // Add extra offset for middle column (column 2) to create height difference
    if (column === 2) {
      top += 50;
    }

    // Add offset for non-Idol Cover sections to maintain original position
    const offsetTop = isIdolCoverSection ? top : top + 317;
    return { left: baseLeft, top: offsetTop };
  };

  const getMobileColumnRow = (imageId: number) => {
    switch (imageId) {
      case 1:
        return { column: 1, row: 1 };
      case 2:
        return { column: 1, row: 2 };
      case 3:
        return { column: 2, row: 1 };
      case 4:
        return { column: 2, row: 2 };
      case 5:
        return { column: 3, row: 1 };
      case 6:
        return { column: 3, row: 2 };
      default:
        return { column: 1, row: 1 };
    }
  };

  return (
    <>
      {/* Desktop Layout */}
      <div
        className="hidden md:block relative transition-opacity duration-300"
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
        {isIdolCoverSection ? (
          // Special layout for Idol Cover section - positioned as background behind text and button
          <>
            {/* Music.png - positioned at absolute coordinates from figma */}
            <motion.div
              className="absolute z-0"
              style={{
                top: '410px',
                left: '309px',
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={
                isReady && isVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
            >
              <Image
                src="/hero-gallery/idol_cover/music.png"
                alt="Idol Cover Music"
                width={630}
                height={357}
                className="w-[630px] h-[357px] object-cover shadow-2xl"
                style={{
                  filter: 'brightness(0.7) contrast(1.1)',
                  borderRadius: '20px',
                }}
                priority
                loading="eager"
              />
            </motion.div>

            {/* Giphy.gif - positioned to overlap with music.png as background */}
            <motion.div
              className="absolute z-0"
              style={{
                top: '456px',
                left: '682px',
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={
                isReady && isVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <Image
                src="/hero-gallery/idol_cover/giphy.gif"
                alt="Idol Cover Animation"
                width={480}
                height={480}
                className="w-[480px] h-[480px] object-cover shadow-2xl"
                style={{
                  filter: 'brightness(0.7) contrast(1.1)',
                  borderRadius: '20px',
                }}
                priority
                loading="eager"
                unoptimized
              />
            </motion.div>
          </>
        ) : (
          // Standard layout for other sections
          images.map((image) => {
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
                  priority
                  loading="eager"
                />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Mobile Layout */}
      <div
        className="md:hidden relative transition-opacity duration-300"
        style={{
          position: 'absolute',
          width: '840px',
          height: '720px',
          left: '50%',
          transform: 'translateX(-420px)',
          opacity: isReady ? 1 : 0,
        }}
        suppressHydrationWarning
      >
        {isIdolCoverSection ? (
          // Special mobile layout for Idol Cover section - as background
          <>
            {/* Music.png - positioned as background for mobile */}
            <motion.div
              className="absolute z-0"
              style={{
                top: '350px',
                left: '50px',
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={
                isReady && isVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
            >
              <Image
                src="/hero-gallery/idol_cover/music.png"
                alt="Idol Cover Music"
                width={400}
                height={226}
                className="w-[400px] h-[226px] object-cover shadow-2xl"
                style={{
                  filter: 'brightness(0.7) contrast(1.1)',
                  borderRadius: '15px',
                }}
                priority
                loading="eager"
              />
            </motion.div>

            {/* Giphy.gif - positioned to overlap for mobile as background */}
            <motion.div
              className="absolute z-0"
              style={{
                top: '400px',
                left: '320px',
              }}
              initial={{ opacity: 0, y: 0 }}
              animate={
                isReady && isVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 0 }
              }
              transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            >
              <Image
                src="/hero-gallery/idol_cover/giphy.gif"
                alt="Idol Cover Animation"
                width={300}
                height={300}
                className="w-[300px] h-[300px] object-cover shadow-2xl"
                style={{
                  filter: 'brightness(0.7) contrast(1.1)',
                  borderRadius: '15px',
                }}
                priority
                loading="eager"
                unoptimized
              />
            </motion.div>
          </>
        ) : (
          // Standard mobile layout for other sections
          mobileImages.map((image) => {
            const mobileLayout = getMobileColumnRow(image.id);
            const position = getMobileImagePosition(
              mobileLayout.column,
              mobileLayout.row
            );
            const delay = (mobileLayout.column - 1) * 0.15;
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
                  width={250}
                  height={330}
                  className="w-[250px] h-[330px] object-cover shadow-2xl min-w-[250px] flex-shrink-0"
                  style={{
                    filter: 'brightness(0.7) contrast(1.1)',
                    borderRadius: '20px',
                  }}
                  priority
                  loading="eager"
                />
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
}
