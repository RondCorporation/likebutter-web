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
import { useTranslation } from 'react-i18next';

type Props = {
  lang: string;
};

export default function LandingPage({ lang }: Props) {
  const { t } = useTranslation();

  const translations = {
    welcomeMessage: t('welcome'),
    startStudio: t('startStudio'),
    featuresTitle: t('featuresTitle'),
    featuresSubtitle: t('featuresSubtitle'),
    feature1Title: t('feature1Title'),
    feature1Desc: t('feature1Desc'),
    feature2Title: t('feature2Title'),
    feature2Desc: t('feature2Desc'),
    feature3Title: t('feature3Title'),
    feature3Desc: t('feature3Desc'),
    feature4Title: t('feature4Title'),
    feature4Desc: t('feature4Desc'),
    demoTitle: t('demoTitle'),
    demoSubtitle: t('demoSubtitle'),
    demoComingSoon: t('demoComingSoon'),
    pricingSectionTitle: t('pricingSectionTitle'),
    pricingSectionSubtitle: t('pricingSectionSubtitle'),
    viewPricing: t('viewPricing'),
    contactTitle: t('contactTitle'),
    contactEmail: t('contactEmail'),
    contactMessage: t('contactMessage'),
    contactSend: t('contactSend'),
    landingPlanFreeDesc: t('landingPlanFreeDesc'),
    landingPlanCreatorDesc: t('landingPlanCreatorDesc'),
    landingTitle: t('landingTitle'),
    landingScroll: t('landingScroll'),
    landingPlanFreeName: t('landingPlanFreeName'),
    landingPlanCreatorName: t('landingPlanCreatorName'),
    landingFeatureCreditsFree: t('landingFeatureCreditsFree'),
    landingFeatureSpeedFree: t('landingFeatureSpeedFree'),
    landingFeatureWatermarkFree: t('landingFeatureWatermarkFree'),
    landingFeatureCreditsCreator: t('landingFeatureCreditsCreator'),
    landingFeatureSpeedCreator: t('landingFeatureSpeedCreator'),
    landingFeatureWatermarkCreator: t('landingFeatureWatermarkCreator'),
  };

  const descSpeed = 30;
  const titleDur = (translations.landingTitle || '').length * 50 + 400;

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
    <main className="bg-black">
      <div className="animated-gradient" />
      <section
        id="about"
        className="relative flex min-h-screen flex-col justify-center overflow-hidden py-16 md:py-0"
      >
        <div className="grid h-full items-center gap-12 px-4 md:grid-cols-2 md:px-12 lg:px-24">
          <div className="z-10 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="mb-4 whitespace-pre-line text-4xl font-bold text-accent md:text-5xl lg:text-6xl"
            >
              <Typewriter text={translations.landingTitle} speed={50} />
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
              className="mx-auto max-w-sm whitespace-pre-line text-base text-slate-300 md:mx-0 md:text-lg"
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
                href={`/${lang}/studio/history`}
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
            className="relative z-0 flex items-center justify-center"
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
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-1 text-accent animate-bounce hidden md:flex">
          <span className="text-xs">{translations.landingScroll}</span>
          <Mouse size={16} />
        </div>
      </section>

      <section
        id="features"
        className="relative flex min-h-screen items-center justify-center bg-neutral-900/80 backdrop-blur-lg py-16 md:py-24"
      >
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent md:text-4xl"
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
            className="grid grid-cols-1 gap-8 sm:grid-cols-2"
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
        className="flex min-h-screen items-center justify-center bg-black py-16 md:py-24"
      >
        <div className="w-full max-w-4xl text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent md:text-4xl"
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
        className="relative flex min-h-screen items-center justify-center bg-neutral-900/80 text-white backdrop-blur-lg py-16 md:py-24"
      >
        <div className="text-center px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="mb-4 text-3xl font-semibold text-accent md:text-4xl"
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
              <h3 className="text-2xl font-bold text-white">
                {translations.landingPlanFreeName}
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                {translations.landingPlanFreeDesc}
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureCreditsFree}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureSpeedFree}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureWatermarkFree}
                </li>
              </ul>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border-2 border-accent bg-accent/5"
            >
              <h3 className="text-2xl font-bold text-accent">
                {translations.landingPlanCreatorName}
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                {translations.landingPlanCreatorDesc}
              </p>
              <ul className="text-left mt-6 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureCreditsCreator}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureSpeedCreator}
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-accent" />{' '}
                  {translations.landingFeatureWatermarkCreator}
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
        className="relative flex min-h-screen flex-col justify-center bg-black"
      >
        <div className="flex-grow flex items-center justify-center py-16 md:py-24">
          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={itemVariants}
            className="w-full max-w-md space-y-4 px-4"
          >
            <h2 className="text-3xl font-semibold text-accent">
              {translations.contactTitle}
            </h2>
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

