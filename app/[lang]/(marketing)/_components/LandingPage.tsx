'use client';

import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CardCarousel from '@/app/_components/CardCarousel';
import { useScrollContext } from '../_context/ScrollContext';

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
      </main>
    </>
  );
}
