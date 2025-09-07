'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, ArrowDown, Check } from 'lucide-react';
import Link from 'next/link';
import { useScrollContext } from '../_context/ScrollContext';
import Image from 'next/image';
import { Plan } from '@/app/_types/plan';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR to prevent hydration layout shift
const RotatingHeroSection = dynamic(() => import('./RotatingHeroSection'), {
  ssr: false,
  loading: () => <div className="h-screen bg-black" />,
});

type LandingPageProps = {
  lang: string;
  plans: Plan[];
};

// Animated element component for scroll-triggered animations
const AnimatedElement = ({
  children,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const variants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[direction]}
      animate={
        isInView ? { x: 0, y: 0, scale: 1, opacity: 1 } : variants[direction]
      }
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Enhanced Page Section Component with viewport fitting
const PageSection = ({
  children,
  className = '',
  id,
  fitViewport = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fitViewport?: boolean;
  style?: React.CSSProperties;
}) => {
  const containerClasses = fitViewport
    ? 'min-h-[calc(var(--vh,1vh)*100)] flex flex-col justify-center py-[7.5rem]'
    : 'py-[7.5rem]';

  return (
    <section
      id={id}
      className={`${containerClasses} ${className}`}
      style={style}
    >
      <div className="container mx-auto max-w-[80rem]">{children}</div>
    </section>
  );
};

const SectionHeader = ({
  yellowText,
  title,
  subtitle,
}: {
  yellowText: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="space-y-6 text-left">
    <AnimatedElement direction="up" delay={0.05} duration={0.3}>
      {/* Yellow Text - Figma: 24px, Bold, #FFD93B */}
      <p className="text-[#FFD93B] text-2xl font-bold font-pretendard leading-[1.5] whitespace-nowrap">
        {yellowText}
      </p>
    </AnimatedElement>
    <AnimatedElement direction="up" delay={0.1} duration={0.3}>
      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-pretendard leading-[1.5] md:leading-[1.5] lg:leading-[1.5]">
        {title.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            {i < title.split('\n').length - 1 && <br />}
          </span>
        ))}
      </h2>
    </AnimatedElement>
    {subtitle && (
      <AnimatedElement direction="up" delay={0.15} duration={0.3}>
        <p
          className="text-slate-400 text-base font-normal leading-6"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {subtitle.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              {i < subtitle.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
      </AnimatedElement>
    )}
  </div>
);

export default function LandingPage({ lang, plans }: LandingPageProps) {
  const { t } = useTranslation();
  const { sectionRefs } = useScrollContext();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [loading, setLoading] = useState(false);

  // Set viewport height CSS variable for mobile browsers
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Plans data is now passed as props from server-side rendering

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Process plans data
  const processedPlans = plans.reduce(
    (acc: { [key: string]: { monthly?: Plan; yearly?: Plan } }, plan) => {
      if (!acc[plan.planType]) {
        acc[plan.planType] = {};
      }
      if (plan.billingCycle === 'MONTHLY') {
        acc[plan.planType].monthly = plan;
      } else if (plan.billingCycle === 'YEARLY') {
        acc[plan.planType].yearly = plan;
      }
      return acc;
    },
    {}
  );

  const isKorean = lang === 'ko';
  const currency = isKorean ? '₩' : '$';

  const getPrice = (planType: string, cycle: 'monthly' | 'yearly') => {
    const plan = processedPlans[planType]?.[cycle];
    if (!plan) return 0;
    return isKorean ? plan.priceKrw : plan.priceUsd;
  };

  const getYearlyMonthlyPrice = (planType: string) => {
    const yearlyPlan = processedPlans[planType]?.yearly;
    if (!yearlyPlan) return 0;
    const yearlyPrice = isKorean ? yearlyPlan.priceKrw : yearlyPlan.priceUsd;
    return Math.floor(yearlyPrice / 12);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString(isKorean ? 'ko-KR' : 'en-US');
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LikeButter',
    url: 'https://www.likebutter.dev',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="font-pretendard">
        {/* Section 1: Rotating Hero Section */}
        <div
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          data-section-index={0}
        >
          <RotatingHeroSection lang={lang} />
        </div>

        {/* Section 2: About Like Butter */}
        <div
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          data-section-index={1}
        >
          <PageSection id="about" fitViewport className="bg-black text-white">
            <div className="h-full flex flex-col">
              <SectionHeader
                yellowText="ABOUT LIKE BUTTER."
                title={t('sectionAboutTitle')}
                subtitle={t('sectionAboutDesc')}
              />

              {/* Cards Section */}
              <div className="mt-20 flex-1 flex items-end">
                <div className="w-full">
                  <div className="flex flex-col md:flex-row justify-center md:justify-end items-center md:items-end gap-4 md:gap-6 lg:gap-8">
                    {/* Card 1 - Butter Talks */}
                    <AnimatedElement direction="up" delay={0.2} duration={0.4}>
                      <motion.div
                        className="transform transition-transform duration-300 hover:scale-105"
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Image
                          src={`/card_1_${lang}.png`}
                          alt="Butter Talks"
                          width={302}
                          height={418}
                          className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatedElement>

                    {/* Card 2 - Butter Cover */}
                    <AnimatedElement direction="up" delay={0.3} duration={0.4}>
                      <motion.div
                        className="transform transition-transform duration-300 hover:scale-105 md:-translate-y-8"
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Image
                          src={`/card_2_${lang}.png`}
                          alt="Butter Cover"
                          width={302}
                          height={418}
                          className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatedElement>

                    {/* Card 3 - Butter Brush */}
                    <AnimatedElement direction="up" delay={0.4} duration={0.4}>
                      <motion.div
                        className="transform transition-transform duration-300 hover:scale-105"
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Image
                          src={`/card_3_${lang}.png`}
                          alt="Butter Brush"
                          width={302}
                          height={418}
                          className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                          priority
                        />
                      </motion.div>
                    </AnimatedElement>
                  </div>
                </div>
              </div>
            </div>
          </PageSection>
        </div>

        {/* Section 3: Live Demo */}
        <div
          ref={(el) => {
            sectionRefs.current[2] = el;
          }}
          data-section-index={2}
        >
          <PageSection
            fitViewport
            className="relative text-white overflow-hidden"
            style={{ backgroundColor: '#131313' }}
          >
            <div className="h-full flex flex-col">
              <SectionHeader
                yellowText="LIVE DEMO."
                title={t('sectionDemoTitle')}
                subtitle={t('sectionDemoDesc')}
              />

              {/* Mobile Mockup Placeholder */}
              <div className="mt-20 flex-1 flex items-center justify-center lg:justify-end">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
                  <div></div> {/* Empty space for layout balance */}
                  <div className="flex justify-center lg:justify-end">
                    <AnimatedElement
                      direction="right"
                      delay={0.2}
                      duration={0.4}
                    >
                      <motion.div
                        className="w-[300px] md:w-[400px] lg:w-[488px] h-[460px] md:h-[600px] lg:h-[757px] flex items-center justify-center shadow-2xl rounded-[28px]"
                        style={{ backgroundColor: '#2a2a2a' }}
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <div className="text-center text-gray-500">
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-400">
                            COMING SOON
                          </h3>
                        </div>
                      </motion.div>
                    </AnimatedElement>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10 pointer-events-none"
              aria-hidden="true"
            />
          </PageSection>
        </div>

        {/* Section 4: Pricing */}
        <div
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          data-section-index={3}
        >
          <PageSection id="pricing" fitViewport className="bg-black text-white">
            <div className="h-full flex flex-col">
              <SectionHeader
                yellowText="PLAN."
                title={t('sectionPricingTitle')}
              />

              {/* Billing Toggle and Cards */}
              <div className="mt-20 flex-1 flex flex-col justify-center pb-20">
                {' '}
                {/* mt-20 = 80px gap */}
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-800 rounded-full p-1 flex">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                        billingCycle === 'monthly'
                          ? 'bg-[#FFD93B] text-black'
                          : 'text-white hover:text-[#FFD93B]'
                      }`}
                    >
                      {t('monthly')}
                    </button>
                    <button
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                        billingCycle === 'yearly'
                          ? 'bg-[#FFD93B] text-black'
                          : 'text-white hover:text-[#FFD93B]'
                      }`}
                    >
                      {t('yearly')} <span className="ml-1 text-xs">(-20%)</span>
                    </button>
                  </div>
                </div>
                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {/* Free Plan */}
                  <AnimatedElement direction="up" delay={0.4}>
                    <div className="bg-[#1A1A1A] rounded-[20px] border border-[#313131] flex flex-col h-full">
                      <div className="p-6 flex-1">
                        <div className="text-center">
                          <h3 className="text-white text-xl font-bold mb-4 h-[28px] flex items-center justify-center">
                            {t('planFreeName')}
                          </h3>
                          <div className="h-[80px] flex items-center justify-center">
                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                              {t('planFreeDesc')}
                            </p>
                          </div>
                          <div className="h-[72px] flex flex-col items-center justify-center">
                            <div className="text-[#FFD93B] text-3xl font-bold mb-2">
                              Free
                              <span className="text-gray-400 text-lg">/월</span>
                            </div>
                            <div className="h-[20px]"></div>
                          </div>
                        </div>
                        <div className="h-[120px] mt-4">
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planFreeFeature1')}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planFreeFeature2')}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planFreeFeature3')}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Link
                          href={`/${lang}/signup`}
                          className="w-full block text-center rounded-[8px] bg-[#4A4A4A] hover:bg-[#555555] px-6 py-3 text-white font-medium transition-colors duration-300"
                        >
                          {t('planFreeCta')}
                        </Link>
                      </div>
                    </div>
                  </AnimatedElement>

                  {/* Creator Plan */}
                  <AnimatedElement direction="up" delay={0.5}>
                    <div className="bg-transparent rounded-[20px] border-2 border-[#FFD93B] flex flex-col h-full">
                      <div className="p-6 flex-1">
                        <div className="text-center">
                          <h3 className="text-white text-xl font-bold mb-4 h-[28px] flex items-center justify-center">
                            {t('planCreatorName')}
                          </h3>
                          <div className="h-[80px] flex items-center justify-center">
                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                              {t('planCreatorDesc')}
                            </p>
                          </div>
                          <div className="h-[72px] flex flex-col items-center justify-center">
                            <div className="text-[#FFD93B] text-3xl font-bold mb-2">
                              {currency}
                              {formatPrice(
                                billingCycle === 'yearly'
                                  ? getYearlyMonthlyPrice('CREATOR')
                                  : getPrice('CREATOR', 'monthly')
                              )}
                              <span className="text-gray-400 text-lg">/월</span>
                            </div>
                            {billingCycle === 'yearly' ? (
                              <p className="text-gray-500 text-sm">
                                연간 결제시 20% 할인!
                              </p>
                            ) : (
                              <div className="h-[20px]"></div>
                            )}
                          </div>
                        </div>
                        <div className="h-[120px] mt-4">
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planCreatorFeature1')}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planCreatorFeature2')}
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                {t('planCreatorFeature3')}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Link
                          href={`/${lang}/billing?plan=basic&billing=${billingCycle}`}
                          className="w-full block text-center rounded-[8px] bg-[#FFD93B] hover:bg-[#FFD93B]/90 text-black px-6 py-3 font-medium transition-colors duration-300"
                        >
                          {t('planCreatorCta')}
                        </Link>
                      </div>
                    </div>
                  </AnimatedElement>

                  {/* Professional Plan */}
                  <AnimatedElement direction="up" delay={0.6}>
                    <div className="bg-transparent rounded-[20px] border-2 border-[#FFD93B] flex flex-col h-full">
                      <div className="p-6 flex-1">
                        <div className="text-center">
                          <h3 className="text-white text-xl font-bold mb-4 h-[28px] flex items-center justify-center">
                            {t('planProfessionalName')}
                          </h3>
                          <div className="h-[80px] flex items-center justify-center">
                            <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed">
                              {t('planProfessionalDesc')}
                            </p>
                          </div>
                          <div className="h-[72px] flex flex-col items-center justify-center">
                            <div className="text-[#FFD93B] text-3xl font-bold mb-2">
                              {currency}
                              {formatPrice(
                                billingCycle === 'yearly'
                                  ? getYearlyMonthlyPrice('PROFESSIONAL')
                                  : getPrice('PROFESSIONAL', 'monthly')
                              )}
                              <span className="text-gray-400 text-lg">/월</span>
                            </div>
                            {billingCycle === 'yearly' ? (
                              <p className="text-gray-500 text-sm">
                                연간 결제시 20% 할인!
                              </p>
                            ) : (
                              <div className="h-[20px]"></div>
                            )}
                          </div>
                        </div>
                        <div className="h-[200px] mt-4">
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                월 12,000 크레딧
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                우선 생성 속도
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                워터마크 없음
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                무제한 크레딧 이월
                              </span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-300">
                                추가 크레딧 구매
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="p-6 pt-0">
                        <Link
                          href={`/${lang}/billing?plan=pro&billing=${billingCycle}`}
                          className="w-full block text-center rounded-[8px] bg-[#FFD93B] hover:bg-[#FFD93B]/90 text-black px-6 py-3 font-medium transition-colors duration-300"
                        >
                          {t('planProfessionalCta')}
                        </Link>
                      </div>
                    </div>
                  </AnimatedElement>
                </div>
              </div>
            </div>
          </PageSection>
        </div>

        {/* Section 5: Contact Us */}
        <div
          ref={(el) => {
            sectionRefs.current[4] = el;
          }}
          data-section-index={4}
        >
          <PageSection className="bg-black text-white">
            <div className="flex justify-center">
              <AnimatedElement direction="scale" delay={0.2} duration={0.5}>
                <div className="bg-gradient-to-r from-[#FFD93B] to-[#F2DC8D] text-black rounded-3xl max-w-6xl w-full h-[320px]">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr] gap-4 h-full">
                    {/* Left side - Title */}
                    <div className="pt-[38px] pl-[83px] pr-8">
                      <h2 className="text-[23px] font-bold mb-4">
                        CONTACT US.
                      </h2>
                      <p className="text-[36px] font-bold whitespace-pre-line">
                        {t('sectionContactTitle')}
                      </p>
                    </div>

                    {/* Right side - Form */}
                    <div className="pt-[38px] pl-8 pr-[83px] pb-12">
                      <form
                        onSubmit={handleContactSubmit}
                        className="space-y-4 h-full flex flex-col"
                      >
                        <div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('contactFormEmail')}
                            className="w-full px-4 py-3 rounded-[8px] text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder-[#B1B1B1]"
                            style={{ fontSize: '14px' }}
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('contactFormMessage')}
                            className="w-full h-full px-4 py-3 rounded-[8px] text-sm bg-white border-0 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none placeholder-[#B1B1B1]"
                            style={{ fontSize: '14px' }}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-black text-[#FFD93B] px-8 py-4 rounded-[8px] text-lg font-bold hover:bg-gray-800 transition-colors duration-300"
                        >
                          {t('contactFormSubmit')}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </AnimatedElement>
            </div>
          </PageSection>
        </div>
      </main>
    </>
  );
}
