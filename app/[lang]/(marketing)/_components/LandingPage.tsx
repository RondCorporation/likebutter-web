'use client';

import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Logo from '@/components/Logo';
import { usePathname } from 'next/navigation';

// Reusable Page Section Component with robust padding and alignment
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
    center: 'pt-24', // Clears header, content is centered in remaining space
    top: 'pt-32', // Clears header and adds 2rem (8*4px) of space for titles
  };

  const containerClasses = wide ? 'w-full px-4 sm:px-6' : 'container mx-auto px-4 sm:px-6';

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

// Simplified and refactored for robust snap scrolling.
export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const [currentCard, setCurrentCard] = useState(0);
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const companyContactEmail = 'info@rondcorp.com';
  const businessInquiryEmail = 'biz@likebutter.ai';

  const cards = [
    { title: 'Card News 1', gradient: 'from-purple-600 to-blue-500' },
    { title: 'Card News 2', gradient: 'from-pink-500 to-orange-400' },
    { title: 'Card News 3', gradient: 'from-green-400 to-teal-500' },
    { title: 'Card News 4', gradient: 'from-yellow-400 to-red-500' },
  ];

  const nextCard = () => setCurrentCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  const prevCard = () => setCurrentCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));

  const BUTTER_SERIES = [
    { name: 'ButterGen', description: [t('butterGenDesc1'), t('butterGenDesc2')], link: `/${lang}/studio/butter-gen` },
    { name: 'ButterCover', description: [t('butterCoverDesc1'), t('butterCoverDesc2')], link: `/${lang}/studio/butter-cover` },
    { name: 'ButterTalks', description: [t('butterTalksDesc1'), t('butterTalksDesc2')], link: `/${lang}/studio/butter-talks` },
    { name: 'ButterBrush', description: [t('butterBrushDesc1'), t('butterBrushDesc2')], link: `/${lang}/studio/butter-brush` },
  ];

  const handleLangChange = (newLang: string) => {
    window.location.href = `/${newLang}`;
  };

  return (
    <div
      className="bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end text-white h-screen snap-y snap-mandatory overflow-y-scroll"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-24">
        <div className="bg-slate-900/50 text-white">
          <div className="container mx-auto flex justify-end items-center px-4 sm:px-6 h-8 text-sm">
            <div className="flex items-center gap-4">
              <select onChange={(e) => handleLangChange(e.target.value)} value={i18n.language} className="bg-transparent cursor-pointer">
                <option value="ko" className="text-black">한국어</option>
                <option value="en" className="text-black">English</option>
              </select>
              <Link href="#" className="hover:underline">{t('customerCenter')}</Link>
              <Link href="#" className="hover:underline">{t('notices')}</Link>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/20 backdrop-blur-sm border-b border-white/10 h-16">
          <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 h-full">
            <div className="flex items-center gap-10">
              <Logo className="text-3xl" />
              <nav className="hidden md:flex gap-6">
                <Link href="#" className="text-sm hover:text-accent">{t('navServices')}</Link>
                <Link href={`/${lang}/pricing`} className="text-sm hover:text-accent">{t('navPricing')}</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/${lang}/login`} className="hover:text-accent text-sm">{t('login')}</Link>
              <Link href={`/${lang}/signup`} className="rounded-full bg-[#FFD93B] px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105">
                {t('signUp')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main>
        {/* Page 1: Hero Section */}
        <PageSection>
          <div className="text-center relative z-10">
            <div className="text-4xl md:text-6xl font-bold min-h-[150px] md:min-h-[200px] flex flex-col items-center justify-center">
              <span className="font-light text-gray-300">{t('heroTitle_soft')}</span>
              <span className="font-extrabold text-white mt-2">{t('heroTitle_main')}</span>
            </div>
            <Link
              href={`/${lang}/signup`}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-10 py-4 text-xl font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-all duration-300 hover:scale-105 hover:shadow-butter-yellow/40 hover:-translate-y-1 animate-fade-in"
            >
              <Sparkles size={24} />
              {t('getStarted')}
            </Link>
          </div>
        </PageSection>

        {/* Page 2: Gradient Cards Section */}
        <PageSection wide={true}>
          <div>
            <div className="relative w-full">
              <div className="overflow-hidden rounded-3xl">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentCard * 100}%)` }}>
                  {cards.map((card, index) => (
                    <div key={index} className={`flex-shrink-0 w-full h-[75vh] bg-gradient-to-br ${card.gradient} flex justify-center items-center`}>
                      <span className="text-white text-4xl font-bold">{card.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-6 justify-center">
              <button
                type="button"
                onClick={prevCard}
                className="bg-white/20 text-white rounded-full p-3 hover:bg-white/40 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-3">
                {cards.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentCard(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentCard === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextCard}
                className="bg-white/20 text-white rounded-full p-3 hover:bg-white/40 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </PageSection>

        {/* Page 3: Fandom & Video Section */}
        <PageSection verticalAlign="top">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-left">{t('fandomParadigm')}</h2>
            <div className="mt-12 aspect-video w-full">
              <video className="h-full w-full object-cover rounded-2xl" autoPlay loop muted playsInline src="/hero-bg.mp4" />
            </div>
          </div>
        </PageSection>

        {/* Page 4: Butter Series Section */}
        <PageSection verticalAlign="top">
          <div className="w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-left mb-12">{t('butterSeriesTitle')}</h2>
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {BUTTER_SERIES.map((service) => (
                <Link href={service.link} key={service.name}>
                  <div className="bg-slate-800/50 rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:bg-slate-700/60 cursor-pointer">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{service.name}</h3>
                      <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
                        {service.description.map((desc, i) => <li key={i}>{desc}</li>)}
                      </ul>
                    </div>
                    <div className="flex justify-end mt-4"><ArrowRight size={24} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </PageSection>

        {/* Page 5: Footer Section */}
        <section className="h-screen snap-start relative">
          <div className="w-full h-full flex flex-col justify-end pt-24" style={{ boxSizing: 'border-box' }}>
            <div className="w-full h-[calc(100%-6rem)] bg-[#0A192F] rounded-t-3xl flex flex-col justify-center items-center">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="w-48 mx-auto mb-12"><Logo /></div>
                <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4 md:text-left text-sm text-slate-400">
                  <div className="space-y-3 md:col-span-2">
                    <h3 className="font-semibold text-base text-accent">LIKEBUTTER</h3>
                    <p className="text-slate-300">© {new Date().getFullYear()} {t('companyName')}. {t('footerRights')}</p>
                    <p>{t('companyAddress')}</p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base text-white">{t('footerNavigate')}</h3>
                    <nav className="flex flex-col space-y-2 items-center md:items-start">
                      <Link href={`/${lang}/pricing`} className="w-fit transition-colors hover:text-accent">{t('navPricing')}</Link>
                      <Link href={`/${lang}/studio`} className="w-fit transition-colors hover:text-accent">{t('footerStudioAccess')}</Link>
                    </nav>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base text-white">{t('footerContactLegal')}</h3>
                    <nav className="flex flex-col space-y-2 items-center md:items-start">
                      <a href={`mailto:${businessInquiryEmail}`} className="w-fit transition-colors hover:text-accent">{t('footerBusinessInquiries')}</a>
                      <a href={`mailto:${companyContactEmail}`} className="w-fit transition-colors hover:text-accent">{t('footerGeneralSupport')}</a>
                      <Link href={`/${lang}/privacy`} className="w-fit transition-colors hover:text-accent">{t('footerPrivacyPolicy')}</Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}