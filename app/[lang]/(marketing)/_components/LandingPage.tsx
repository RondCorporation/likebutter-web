'use client';

import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CardCarousel from '@/app/_components/CardCarousel';
import { useScrollContext } from '../_context/ScrollContext';
import { motion, useScroll, useTransform } from 'framer-motion';

// Reusable Page Section Component
const PageSection = ({
  children,
  className = '',
  verticalAlign = 'center',
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  verticalAlign?: 'center' | 'top';
  wide?: boolean;
}) => {
  const alignmentClasses = {
    center: 'justify-center',
    top: 'justify-start',
  };
  const paddingClasses = {
    center: 'pt-24',
    top: 'pt-32',
  };
  const containerClasses = wide
    ? 'w-full'
    : 'container mx-auto px-4 sm:px-6 max-w-screen-xl';

  return (
    <section className={`h-screen snap-start ${className}`}>
      <div
        className={`${containerClasses} h-full flex flex-col ${alignmentClasses[verticalAlign]} items-center ${paddingClasses[verticalAlign]}`}
        style={{ boxSizing: 'border-box' }}
      >
        {children}
      </div>
    </section>
  );
};

export default function LandingPage() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const { sectionRefs } = useScrollContext();

  const cards = [
    { 
      title: t('cardAIImage'), 
      subtitle: t('cardAIImageDesc'),
      gradient: 'from-purple-600 to-blue-500',
      icon: '🎨'
    },
    { 
      title: t('cardVoiceSynthesis'), 
      subtitle: t('cardVoiceSynthesisDesc'),
      gradient: 'from-pink-500 to-orange-400',
      icon: '🎵'
    },
    { 
      title: t('cardVideoEditing'), 
      subtitle: t('cardVideoEditingDesc'),
      gradient: 'from-green-400 to-teal-500',
      icon: '🎬'
    },
    { 
      title: t('cardCreativeTools'), 
      subtitle: t('cardCreativeToolsDesc'),
      gradient: 'from-yellow-400 to-red-500',
      icon: '✨'
    },
  ];

  const BUTTER_SERIES = [
    {
      name: 'ButterGen',
      icon: '🎨',
      gradient: 'from-purple-500 to-pink-500',
      description: [t('butterGenDesc1'), t('butterGenDesc2')],
      link: `/${lang}/studio/butter-gen`,
    },
    {
      name: 'ButterCover',
      icon: '🎵',
      gradient: 'from-blue-500 to-teal-500',
      description: [t('butterCoverDesc1'), t('butterCoverDesc2')],
      link: `/${lang}/studio/butter-cover`,
    },
    {
      name: 'ButterTalks',
      icon: '💬',
      gradient: 'from-green-500 to-emerald-500',
      description: [t('butterTalksDesc1'), t('butterTalksDesc2')],
      link: `/${lang}/studio/butter-talks`,
    },
    {
      name: 'ButterBrush',
      icon: '✨',
      gradient: 'from-orange-500 to-red-500',
      description: [t('butterBrushDesc1'), t('butterBrushDesc2')],
      link: `/${lang}/studio/butter-brush`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'likebutter',
    url: 'https://www.likebutter.dev',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <div
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          data-section-index={0}
        >
          <PageSection className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 animate-pulse"></div>
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-butter-yellow/5 rounded-full blur-3xl animate-bounce" style={{animationDelay: '0s', animationDuration: '6s'}}></div>
              <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-butter-orange/5 rounded-full blur-3xl animate-bounce" style={{animationDelay: '2s', animationDuration: '8s'}}></div>
              <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl animate-bounce" style={{animationDelay: '4s', animationDuration: '7s'}}></div>
            </div>
            
            <div className="text-center relative z-10 px-4">
              <div className="mb-6">
                <p className="text-3xl sm:text-4xl md:text-6xl font-light text-slate-200 animate-fade-in leading-tight">
                  {t('heroTitle_soft')}
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-butter-yellow to-butter-orange bg-clip-text text-transparent mt-2 animate-fade-in-up leading-tight">
                  {t('heroTitle_main')}
                </h1>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up w-full max-w-md sm:max-w-none mx-auto" style={{animationDelay: '0.5s'}}>
                <Link
                  href={`/${lang}/signup`}
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-all will-change-transform duration-300 hover:-translate-y-2 hover:shadow-butter-yellow/40 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-butter-yellow w-full sm:w-auto justify-center"
                >
                  <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
                  <span className="truncate">{t('getStarted')}</span>
                </Link>
                <Link
                  href={`/${lang}/pricing`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white border border-white/30 transition-all duration-300 hover:bg-white/30 hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white w-full sm:w-auto justify-center"
                >
                  <span className="truncate">{t('viewPricing')}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                </Link>
              </div>
            </div>
          </PageSection>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          data-section-index={1}
        >
          <PageSection wide={true} className="[&_*]:snap-none">
            <CardCarousel slides={cards} />
          </PageSection>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          data-section-index={2}
        >
          <PageSection verticalAlign="top">
            <motion.div 
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-left"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t('fandomParadigm')}
              </motion.h2>
              <motion.div 
                className="mt-12 aspect-video w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <video
                  className="h-full w-full object-cover rounded-2xl shadow-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="/hero-bg.mp4"
                  poster="/hero-poster.jpg"
                  preload="none"
                />
              </motion.div>
            </motion.div>
          </PageSection>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          data-section-index={3}
        >
          <PageSection verticalAlign="top">
            <motion.div 
              className="w-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-left mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {t('butterSeriesTitle')}
              </motion.h2>
              <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                {BUTTER_SERIES.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Link href={service.link}>
                      <div className="group relative overflow-hidden bg-slate-800/50 rounded-2xl p-6 sm:p-8 h-full flex flex-col justify-between transition-all will-change-transform duration-500 cursor-pointer border border-slate-700/50 hover:border-slate-600">
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                        <div className="relative z-10">
                          <motion.div 
                            className="flex items-center gap-3 sm:gap-4 mb-4"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <motion.div 
                              className="text-3xl sm:text-4xl"
                              whileHover={{ rotate: 10, scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {service.icon}
                            </motion.div>
                            <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-butter-yellow transition-colors duration-300">
                              {service.name}
                            </h3>
                          </motion.div>
                          <ul className="space-y-3 text-slate-200 group-hover:text-slate-100 transition-colors duration-300">
                            {service.description.map((desc, i) => (
                              <motion.li 
                                key={i} 
                                className="flex items-start gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
                                viewport={{ once: true }}
                              >
                                <span className="text-butter-orange mt-1 flex-shrink-0">•</span>
                                <span>{desc}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="relative z-10 flex justify-end mt-6">
                          <div className="p-2 rounded-full bg-butter-yellow/10 group-hover:bg-butter-yellow/20 transition-colors duration-300">
                            <ArrowRight size={24} className="text-butter-yellow group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </PageSection>
        </div>
      </main>
    </>
  );
}
