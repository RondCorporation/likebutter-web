'use client';

import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';
import CardCarousel from '@/app/_components/CardCarousel';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollIndicator from '@/app/_components/ScrollIndicator'; // Import the new component

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
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  // State for header elements
  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // State for scroll indicator
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node))
        setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute('data-section-index') || '0',
              10
            );
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const handleLangChange = (newLang: string) => {
    setLangOpen(false);
    window.location.href = `/${newLang}`;
  };

  const supportMenuItems = [
    { label: t('customerCenter'), href: `/${lang}/support` },
    { label: t('faq'), href: `/${lang}/faq` },
    { label: t('notices'), href: `/${lang}/notices` },
    { label: t('termsOfService'), href: `/${lang}/terms` },
  ];

  const companyContactEmail = 'info@rondcorp.com';
  const businessInquiryEmail = 'biz@likebutter.ai';

  const cards = [
    { title: 'Card News 1', gradient: 'from-purple-600 to-blue-500' },
    { title: 'Card News 2', gradient: 'from-pink-500 to-orange-400' },
    { title: 'Card News 3', gradient: 'from-green-400 to-teal-500' },
    { title: 'Card News 4', gradient: 'from-yellow-400 to-red-500' },
  ];

  const BUTTER_SERIES = [
    {
      name: 'ButterGen',
      description: [t('butterGenDesc1'), t('butterGenDesc2')],
      link: `/${lang}/studio/butter-gen`,
    },
    {
      name: 'ButterCover',
      description: [t('butterCoverDesc1'), t('butterCoverDesc2')],
      link: `/${lang}/studio/butter-cover`,
    },
    {
      name: 'ButterTalks',
      description: [t('butterTalksDesc1'), t('butterTalksDesc2')],
      link: `/${lang}/studio/butter-talks`,
    },
    {
      name: 'ButterBrush',
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
      <ScrollIndicator count={5} activeIndex={activeIndex} />
      <div
        className="bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end text-white h-screen snap-y snap-mandatory overflow-y-scroll overscroll-contain"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="fixed top-0 left-0 right-0 z-50 h-24" role="banner">
          {/* Top Bar */}
          <div className="bg-slate-900/50 text-white h-8">
            <div className="container mx-auto flex justify-end items-center px-4 sm:px-6 h-full text-sm">
              <div className="flex items-center gap-4">
                {/* Custom Language Dropdown */}
                <div className="relative" ref={langRef}>
                  <button
                    onClick={() => setLangOpen(!isLangOpen)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={isLangOpen}
                  >
                    <span>{i18n.language.toUpperCase()}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-32 bg-[#1A2B42] border border-white/10 rounded-lg shadow-lg z-10"
                      >
                        <button
                          onClick={() => handleLangChange('ko')}
                          className="w-full text-left px-4 py-2 hover:bg-white/10"
                        >
                          한국어
                        </button>
                        <button
                          onClick={() => handleLangChange('en')}
                          className="w-full text-left px-4 py-2 hover:bg-white/10"
                        >
                          English
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* New Support Dropdown Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!isMenuOpen)}
                    className="p-1 hover:bg-white/10 rounded-full"
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                    aria-label={t('supportAndNotices')}
                  >
                    <Menu size={16} />
                  </button>
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[#1A2B42] border border-white/10 rounded-lg shadow-lg z-10 py-1"
                      >
                        {supportMenuItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-white/10"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
          {/* Main Header */}
          <div className="bg-slate-800/20 backdrop-blur-sm border-b border-white/10 h-16">
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-full">
              <div className="flex items-center gap-10">
                <Logo className="text-3xl" />
                <nav
                  className="hidden md:flex gap-6"
                  aria-label={t('mainNavigation')}
                >
                  <Link href="#" className="text-sm hover:text-accent">
                    {t('navServices')}
                  </Link>
                  <Link
                    href={`/${lang}/pricing`}
                    className="text-sm hover:text-accent"
                  >
                    {t('navPricing')}
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/${lang}/login`}
                  className="hover:text-accent text-sm"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${lang}/signup`}
                  className="rounded-full bg-[#FFD93B] px-5 py-2 text-sm font-bold text-black transition-transform will-change-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                >
                  {t('signUp')}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main>
          <div
            ref={(el) => {
              sectionRefs.current[0] = el;
            }}
            data-section-index={0}
          >
            <PageSection>
              <div className="text-center relative z-10">
                <p className="text-4xl md:text-6xl font-light text-slate-200">
                  {t('heroTitle_soft')}
                </p>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2">
                  {t('heroTitle_main')}
                </h1>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={`/${lang}/signup`}
                    className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-3 text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform will-change-transform duration-300 hover:-translate-y-1 hover:shadow-butter-yellow/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-butter-yellow"
                  >
                    <Sparkles size={20} />
                    {t('getStarted')}
                  </Link>
                  <Link
                    href={`/${lang}/pricing`}
                    className="inline-flex items-center gap-2 rounded-full bg-white/30 px-8 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {t('viewPricing')}
                    <ArrowRight size={20} />
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
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-left">
                  {t('fandomParadigm')}
                </h2>
                <div className="mt-12 aspect-video w-full">
                  <video
                    className="h-full w-full object-cover rounded-2xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                    src="/hero-bg.mp4"
                    poster="/hero-poster.jpg"
                    preload="none"
                  />
                </div>
              </div>
            </PageSection>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[3] = el;
            }}
            data-section-index={3}
          >
            <PageSection verticalAlign="top">
              <div className="w-full">
                <h2 className="text-4xl md:text-5xl font-bold text-left mb-12">
                  {t('butterSeriesTitle')}
                </h2>
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {BUTTER_SERIES.map((service) => (
                    <Link href={service.link} key={service.name}>
                      <div className="bg-slate-800/50 rounded-2xl p-6 h-full flex flex-col justify-between transition-transform will-change-transform duration-300 hover:scale-105 hover:bg-slate-700/60 cursor-pointer">
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {service.name}
                          </h3>
                          <ul className="mt-4 space-y-2 text-slate-200 list-disc list-inside">
                            {service.description.map((desc, i) => (
                              <li key={i}>{desc}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-end mt-4">
                          <ArrowRight size={24} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </PageSection>
          </div>

          <div
            ref={(el) => {
              sectionRefs.current[4] = el;
            }}
            data-section-index={4}
          >
            <section className="h-screen snap-start relative">
              <div
                className="w-full h-full flex flex-col justify-end pt-24"
                style={{ boxSizing: 'border-box' }}
              >
                <div className="w-full h-[calc(100%-6rem)] bg-[#0A192F] rounded-t-3xl flex flex-col justify-center items-center">
                  <div className="container mx-auto px-4 sm:px-6">
                    <div className="w-48 mx-auto mb-12">
                      <Logo />
                    </div>
                    <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left text-sm text-slate-400">
                      <div className="space-y-3 md:col-span-2">
                        <h3 className="font-semibold text-base text-accent">
                          LIKEBUTTER
                        </h3>
                        <p className="text-slate-300">
                          © {new Date().getFullYear()} {t('companyName')}.{' '}
                          {t('footerRights')}
                        </p>
                        <p>{t('companyAddress')}</p>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-white">
                          {t('footerNavigate')}
                        </h3>
                        <nav className="flex flex-col space-y-2 items-center md:items-start">
                          <Link
                            href={`/${lang}/pricing`}
                            className="w-fit transition-colors hover:text-accent"
                          >
                            {t('navPricing')}
                          </Link>
                          <Link
                            href={`/${lang}/studio`}
                            className="w-fit transition-colors hover:text-accent"
                          >
                            {t('footerStudioAccess')}
                          </Link>
                        </nav>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-semibold text-base text-white">
                          {t('footerContactLegal')}
                        </h3>
                        <nav className="flex flex-col space-y-2 items-center md:items-start">
                          <a
                            href={`mailto:${businessInquiryEmail}`}
                            className="w-fit transition-colors hover:text-accent"
                          >
                            {t('footerBusinessInquiries')}
                          </a>
                          <a
                            href={`mailto:${companyContactEmail}`}
                            className="w-fit transition-colors hover:text-accent"
                          >
                            {t('footerGeneralSupport')}
                          </a>
                          <Link
                            href={`/${lang}/privacy`}
                            className="w-fit transition-colors hover:text-accent"
                          >
                            {t('footerPrivacyPolicy')}
                          </Link>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
