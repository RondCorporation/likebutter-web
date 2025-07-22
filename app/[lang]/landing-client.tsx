'use client';

import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import Typewriter from '@/components/Typewriter';
import LazyYoutube from '@/components/LazyYoutube';
import {
  Bot,
  Clapperboard,
  Music,
  Palette,
  Check,
  Sparkles,
  Mouse,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const SECTIONS = ['about', 'features', 'demo', 'pricing', 'contact'];

type Translations = {
  welcomeMessage: string;
  startStudio: string;
  featuresTitle: string;
  featuresSubtitle: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  demoTitle: string;
  demoSubtitle: string;
  demoComingSoon: string;
  pricingSectionTitle: string;
  pricingSectionSubtitle: string;
  viewPricing: string;
  contactTitle: string;
  contactEmail: string;
  contactMessage: string;
  contactSend: string;
  landingPlanFreeDesc: string;
  landingPlanCreatorDesc: string;
  landingTitle: string;
  landingScroll: string;
  landingPlanFreeName: string;
  landingPlanCreatorName: string;
  landingFeatureCreditsFree: string;
  landingFeatureSpeedFree: string;
  landingFeatureWatermarkFree: string;
  landingFeatureCreditsCreator: string;
  landingFeatureSpeedCreator: string;
  landingFeatureWatermarkCreator: string;
};

type Props = {
  lang: string;
  translations: Translations;
};

export default function LandingClient({ lang, translations }: Props) {
  const descSpeed = 30;
  const titleDur = translations.landingTitle.length * 50 + 400;

  const FEATURES = [
    {
      icon: Bot,
      title: translations.feature1Title,
      desc: translations.feature1Desc,
    },
    {
      icon: Music,
      title: translations.feature2Title,
      desc: translations.feature2Desc,
    },
    {
      icon: Palette,
      title: translations.feature3Title,
      desc: translations.feature3Desc,
    },
    {
      icon: Clapperboard,
      title: translations.feature4Title,
      desc: translations.feature4Desc,
    },
  ];

  const mainRef = useRef<HTMLElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;

      const scrollDown = e.deltaY > 0;
      setIsScrolling(true);

      if (scrollDown) {
        if (currentSection < SECTIONS.length - 1) {
          const nextSectionIndex = currentSection + 1;
          document
            .getElementById(SECTIONS[nextSectionIndex])
            ?.scrollIntoView({ behavior: 'smooth' });
          setCurrentSection(nextSectionIndex);
        }
      } else {
        if (currentSection > 0) {
          const prevSectionIndex = currentSection - 1;
          document
            .getElementById(SECTIONS[prevSectionIndex])
            ?.scrollIntoView({ behavior: 'smooth' });
          setCurrentSection(prevSectionIndex);
        }
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isScrolling, currentSection]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <main ref={mainRef} className="h-screen overflow-y-hidden bg-black">
      <div className="animated-gradient" />
      <section
        id="about"
        className="relative flex h-screen flex-col justify-center overflow-hidden"
      >
        <div className="grid h-full items-center px-8 md:grid-cols-2 md:px-24">
          <div className="z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mb-4 whitespace-pre-line text-4xl font-bold text-accent md:text-7xl"
            >
              <Typewriter text={translations.landingTitle} speed={50} />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              className="max-w-sm whitespace-pre-line text-lg text-slate-300 md:text-xl"
            >
              <Typewriter
                text={translations.welcomeMessage}
                speed={descSpeed}
                startDelay={titleDur}
                keepCursor
              />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
            >
              <Link
                href={`/${lang}/studio`}
                className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90"
              >
                {translations.startStudio}
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative z-0 hidden items-center justify-center md:flex"
          >
            <LazyYoutube
              videoId="mPVDGOVjRQ0"
              className="w-full rounded-lg shadow-2xl shadow-accent/10"
            />
          </motion.div>
        </div>

        <div className="wave-container">
          <svg
            className="wave-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="wave"
                d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="animate-wave-slow opacity-20 blur-sm">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
            <g className="animate-wave-mid opacity-50 blur-sm">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
            <g className="animate-wave-fast opacity-70">
              <use xlinkHref="#wave" fill="var(--accent)" />
            </g>
          </svg>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-accent animate-bounce">
          <span className="text-xs">{translations.landingScroll}</span>
          <Mouse size={16} />
        </div>
      </section>

      <section
        id="features"
        className="relative flex h-screen items-center justify-center bg-neutral-900/80 backdrop-blur-lg"
      >
        <div className="container mx-auto max-w-5xl px-8 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            {translations.featuresTitle}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 text-slate-300"
          >
            {translations.featuresSubtitle}
          </motion.p>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-left transition-all duration-300 hover:border-accent/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-accent" />
                  <h3 className="text-xl font-bold">{f.title}</h3>
                </div>
                <p className="text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="demo"
        className="flex h-screen items-center justify-center bg-black"
      >
        <div className="w-full max-w-4xl text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            {translations.demoTitle}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 text-slate-300"
          >
            {translations.demoSubtitle}
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.2 }}
            className="h-96 w-full rounded-lg border border-white/20 bg-white/5 p-6 backdrop-blur-sm flex items-center justify-center text-slate-400"
          >
            <p className="flex items-center gap-2">
              <Sparkles size={20} className="text-accent" />
              {translations.demoComingSoon}
            </p>
          </motion.div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative flex h-screen items-center justify-center bg-neutral-900/80 text-white backdrop-blur-lg"
      >
        <div className="text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent"
          >
            {translations.pricingSectionTitle}
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="mb-12 max-w-xl text-slate-300"
          >
            {translations.pricingSectionSubtitle}
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border border-white/10 bg-white/5"
            >
              <h3 className="text-2xl font-bold text-white">{translations.landingPlanFreeName}</h3>
              <p className="text-sm text-slate-400 mt-2">
                {translations.landingPlanFreeDesc}
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureCreditsFree}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureSpeedFree}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureWatermarkFree}
                </li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border-2 border-accent bg-accent/5"
            >
              <h3 className="text-2xl font-bold text-accent">{translations.landingPlanCreatorName}</h3>
              <p className="text-sm text-slate-400 mt-2">
                {translations.landingPlanCreatorDesc}
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureCreditsCreator}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureSpeedCreator}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" /> {translations.landingFeatureWatermarkCreator}
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Link
              href={`/${lang}/pricing`}
              className="rounded-md bg-accent px-8 py-3 text-base font-semibold text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90"
            >
              {translations.viewPricing}
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="relative flex h-screen flex-col justify-center bg-black"
      >
        <div className="flex-grow flex items-center justify-center">
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="w-full max-w-md space-y-4 px-4"
          >
            <h2 className="text-3xl font-semibold text-accent">{translations.contactTitle}</h2>
            <input
              placeholder={translations.contactEmail}
              className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <textarea
              placeholder={translations.contactMessage}
              rows={4}
              className="w-full rounded-md bg-white/10 p-3 text-sm text-white placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="w-full rounded-md bg-accent py-2 text-sm font-medium text-black transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-90">
              {translations.contactSend}
            </button>
          </motion.form>
        </div>
        <Footer />
      </section>
    </main>
  );
}

