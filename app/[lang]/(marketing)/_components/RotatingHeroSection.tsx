'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { HeroImage } from './HeroImageGallery';
import HeroImageGalleryPlaceholder from './HeroImageGalleryPlaceholder';

const HeroImageGallery = dynamic(() => import('./HeroImageGallery'), {
  ssr: false,
  loading: () => <HeroImageGalleryPlaceholder />,
});

interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  images: HeroImage[];
}

interface RotatingHeroSectionProps {
  lang: string;
}

const SECTION_DURATION = 7000;
const ANIMATION_DURATION = 2000;

export default function RotatingHeroSection({
  lang,
}: RotatingHeroSectionProps) {
  const { t } = useTranslation('marketing');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<
    'entering' | 'visible' | 'exiting'
  >('entering');

  const heroSections: HeroSection[] = [
    {
      id: 1,
      title: 'Mood Switch',
      subtitle: t('hero.rotating.styleSwitch'),
      buttonText: t('hero.rotating.changePhotoMood'),
      buttonHref: `/${lang}/studio`,
      images: [
        {
          id: 1,
          src: '/hero-gallery/hero-1.png',
          alt: 'Mood Switch 1',
          column: 1,
          row: 1,
        },
        {
          id: 2,
          src: '/hero-gallery/hero-2.png',
          alt: 'Mood Switch 2',
          column: 1,
          row: 2,
        },
        {
          id: 3,
          src: '/hero-gallery/hero-3.png',
          alt: 'Mood Switch 3',
          column: 2,
          row: 1,
        },
        {
          id: 4,
          src: '/hero-gallery/hero-4.png',
          alt: 'Mood Switch 4',
          column: 3,
          row: 1,
        },
        {
          id: 5,
          src: '/hero-gallery/hero-5.png',
          alt: 'Mood Switch 5',
          column: 4,
          row: 1,
        },
        {
          id: 6,
          src: '/hero-gallery/hero-6.png',
          alt: 'Mood Switch 6',
          column: 5,
          row: 1,
        },
        {
          id: 7,
          src: '/hero-gallery/hero-7.png',
          alt: 'Mood Switch 7',
          column: 5,
          row: 2,
        },
      ],
    },
    {
      id: 2,
      title: 'Idol Cover',
      subtitle: t('hero.rotating.dreamStage'),
      buttonText: t('hero.rotating.createCoverSong'),
      buttonHref: `/${lang}/studio`,
      images: [
        {
          id: 1,
          src: '/hero-gallery/hero-1.png',
          alt: 'Idol Cover 1',
          column: 1,
          row: 1,
        },
        {
          id: 2,
          src: '/hero-gallery/hero-2.png',
          alt: 'Idol Cover 2',
          column: 1,
          row: 2,
        },
        {
          id: 3,
          src: '/hero-gallery/hero-3.png',
          alt: 'Idol Cover 3',
          column: 2,
          row: 1,
        },
        {
          id: 4,
          src: '/hero-gallery/hero-4.png',
          alt: 'Idol Cover 4',
          column: 3,
          row: 1,
        },
        {
          id: 5,
          src: '/hero-gallery/hero-5.png',
          alt: 'Idol Cover 5',
          column: 4,
          row: 1,
        },
        {
          id: 6,
          src: '/hero-gallery/hero-6.png',
          alt: 'Idol Cover 6',
          column: 5,
          row: 1,
        },
        {
          id: 7,
          src: '/hero-gallery/hero-7.png',
          alt: 'Idol Cover 7',
          column: 5,
          row: 2,
        },
      ],
    },
    {
      id: 3,
      title: 'Art Maker',
      subtitle: t('hero.rotating.onePhotoOneSentence'),
      buttonText: t('hero.rotating.createAiArt'),
      buttonHref: `/${lang}/studio`,
      images: [
        {
          id: 1,
          src: '/hero-gallery/hero-1.png',
          alt: 'Art Maker 1',
          column: 1,
          row: 1,
        },
        {
          id: 2,
          src: '/hero-gallery/hero-2.png',
          alt: 'Art Maker 2',
          column: 1,
          row: 2,
        },
        {
          id: 3,
          src: '/hero-gallery/hero-3.png',
          alt: 'Art Maker 3',
          column: 2,
          row: 1,
        },
        {
          id: 4,
          src: '/hero-gallery/hero-4.png',
          alt: 'Art Maker 4',
          column: 3,
          row: 1,
        },
        {
          id: 5,
          src: '/hero-gallery/hero-5.png',
          alt: 'Art Maker 5',
          column: 4,
          row: 1,
        },
        {
          id: 6,
          src: '/hero-gallery/hero-6.png',
          alt: 'Art Maker 6',
          column: 5,
          row: 1,
        },
        {
          id: 7,
          src: '/hero-gallery/hero-7.png',
          alt: 'Art Maker 7',
          column: 5,
          row: 2,
        },
      ],
    },
  ];

  const currentSection = heroSections[currentSectionIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase('exiting');

      setTimeout(() => {
        setCurrentSectionIndex(
          (prevIndex) => (prevIndex + 1) % heroSections.length
        );
        setAnimationPhase('entering');
      }, ANIMATION_DURATION / 2);
    }, SECTION_DURATION);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (animationPhase === 'entering') {
      const timer = setTimeout(() => {
        setAnimationPhase('visible');
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Gallery Background */}
      <div
        className="absolute left-0 w-full"
        style={{ top: '317px' }}
        aria-hidden="true"
      >
        <HeroImageGallery
          images={currentSection.images}
          isVisible={animationPhase !== 'exiting'}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Gradient overlay for smooth transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black z-30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <section className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto max-w-[80rem]">
          <div className="text-center max-w-4xl mx-auto">
            {/* Title */}
            <motion.h1
              key={`title-${currentSection.id}`}
              initial={{ y: 30, opacity: 0 }}
              animate={
                animationPhase !== 'exiting'
                  ? { y: 0, opacity: 1 }
                  : { y: -30, opacity: 0 }
              }
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="font-pretendard font-extrabold text-[82px] leading-[150%] text-white mb-6"
            >
              {currentSection.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              key={`subtitle-${currentSection.id}`}
              initial={{ y: 20, opacity: 0 }}
              animate={
                animationPhase !== 'exiting'
                  ? { y: 0, opacity: 1 }
                  : { y: -20, opacity: 0 }
              }
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="font-pretendard font-normal text-[22px] leading-[150%] text-[#CCCCCC] mb-12"
            >
              {currentSection.subtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < currentSection.subtitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </motion.div>

            {/* Button */}
            <motion.div
              key={`button-${currentSection.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={
                animationPhase !== 'exiting'
                  ? { y: 0, opacity: 1 }
                  : { y: -15, opacity: 0 }
              }
              transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
            >
              <Link
                href={currentSection.buttonHref}
                className="inline-flex items-center gap-3 rounded-[8px] bg-[#FFD93B] px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:bg-[#FFD93B]/90 hover:scale-105"
              >
                {currentSection.buttonText}
              </Link>
            </motion.div>

            {/* Section Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-2 mt-8"
            >
              {heroSections.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === currentSectionIndex
                      ? 'bg-[#FFD93B]'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
