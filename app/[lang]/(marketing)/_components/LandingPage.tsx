'use client';

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Play, ArrowDown, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useScrollContext } from '../_context/ScrollContext';
import Image from 'next/image';
import { getPlansOnClient } from '@/app/_lib/apis/subscription.api.client';
import { Plan } from '@/app/_types/plan';

// Enhanced Page Section Component with viewport fitting
const PageSection = ({
  children,
  className = '',
  id,
  noPadding = false,
  fitViewport = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
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
      {noPadding ? (
        children
      ) : (
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-[80rem]">
          {children}
        </div>
      )}
    </section>
  );
};

// Section Header Component for consistent typography
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
    {/* Yellow Text - Figma: 24px, Bold, #FFD93B */}
    <p className="text-[#FFD93B] text-2xl font-bold font-pretendard leading-[1.5] whitespace-nowrap">
      {yellowText}
    </p>
    {/* Title - Figma: 48px, Bold, #FFFFFF */}
    <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold font-pretendard leading-[1.5]">
      {title.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i < title.split('\n').length - 1 && <br />}
        </span>
      ))}
    </h2>
    {/* Subtitle - Figma: 16px, Regular, #94A3B8, Arial */}
    {subtitle && (
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
    )}
  </div>
);

export default function LandingPage() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];
  const { sectionRefs } = useScrollContext();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch plans data
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getPlansOnClient();
        if (response.status === 200 && response.data) {
          setPlans(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { email, message });
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
        {/* Section 1: Hero with YouTube Background */}
        <div
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          data-section-index={0}
        >
          <PageSection
            id="hero"
            className="relative overflow-hidden bg-black h-screen flex items-center justify-center"
            noPadding
          >
            {/* YouTube Background */}
            <div className="absolute inset-0 w-full h-full">
              <iframe
                src="https://www.youtube.com/embed/WMweEpGlu_U?autoplay=1&mute=1&loop=1&playlist=WMweEpGlu_U&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                className="w-full h-full object-cover scale-125"
                allow="autoplay; encrypted-media"
                style={{ border: 'none', pointerEvents: 'none' }}
              />
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60"></div>

            {/* Content */}
            <div className="relative z-10 text-left max-w-4xl container mx-auto px-4 sm:px-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight font-archivo-black">
                LikeButter
              </h1>
              <div className="text-2xl md:text-3xl text-white/90 mb-12 leading-relaxed">
                <p>{t('heroTitleLine1')}</p>
                <p>{t('heroTitleLine2')}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Link
                  href={`/${lang}/signup`}
                  className="inline-flex items-center gap-3 rounded-full bg-[#FFD93B] px-8 py-4 text-lg font-bold text-black transition-all duration-300 hover:bg-[#FFD93B]/90 hover:scale-105"
                >
                  {t('heroCtaMain')}
                </Link>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="inline-flex items-center gap-3 rounded-full border-2 border-[#FFD93B] text-[#FFD93B] px-8 py-4 text-lg font-bold bg-transparent transition-all duration-300 hover:bg-[#FFD93B] hover:text-black"
                >
                  <Play size={20} />
                  {t('heroCtaDemo')}
                </button>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center gap-2">
              <span className="text-sm">{t('heroScroll')}</span>
              <ArrowDown size={20} className="animate-bounce" />
            </div>
          </PageSection>
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
                    <div className="transform transition-transform duration-300 hover:scale-105">
                      <Image
                        src="/card-1.png"
                        alt="Butter Talks"
                        width={302}
                        height={418}
                        className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                        priority
                      />
                    </div>

                    {/* Card 2 - Butter Cover */}
                    <div className="transform transition-transform duration-300 hover:scale-105 md:-translate-y-8">
                      <Image
                        src="/card-2.png"
                        alt="Butter Cover"
                        width={302}
                        height={418}
                        className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                        priority
                      />
                    </div>

                    {/* Card 3 - Butter Brush */}
                    <div className="transform transition-transform duration-300 hover:scale-105">
                      <Image
                        src="/card-3.png"
                        alt="Butter Brush"
                        width={302}
                        height={418}
                        className="w-[240px] h-[320px] md:w-[280px] md:h-[380px] lg:w-[302px] lg:h-[418px] rounded-2xl shadow-2xl object-cover"
                        priority
                      />
                    </div>
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
                    <div
                      className="w-[300px] md:w-[400px] lg:w-[488px] h-[460px] md:h-[600px] lg:h-[757px] flex items-center justify-center border border-gray-600 shadow-2xl rounded-[28px]"
                      style={{ backgroundColor: '#2a2a2a' }}
                    >
                      <div className="text-center text-gray-500">
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-400">
                          COMING SOON
                        </h3>
                        <p className="text-sm md:text-base px-4">
                          {t('sectionDemoComingSoon')}
                        </p>
                      </div>
                    </div>
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
                {loading ? (
                  <div className="text-center">로딩 중...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {/* Free Plan */}
                    <div className="bg-[#1A1A1A] rounded-[20px] p-6 border border-[#313131]">
                      <div className="text-center mb-8">
                        <h3 className="text-white text-xl font-bold mb-4">
                          {t('planFreeName')}
                        </h3>
                        <p className="text-gray-300 text-sm mb-8 whitespace-pre-line leading-relaxed">
                          {t('planFreeDesc')}
                        </p>
                        <div className="text-[#FFD93B] text-3xl font-bold mb-8">
                          Free<span className="text-gray-400 text-lg">/월</span>
                        </div>
                      </div>
                      <ul className="space-y-3 mb-8 text-sm">
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planFreeFeature1')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planFreeFeature2')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planFreeFeature3')}</span>
                        </li>
                      </ul>
                      <Link
                        href={`/${lang}/signup`}
                        className="w-full block text-center rounded-[8px] bg-[#4A4A4A] hover:bg-[#555555] px-6 py-3 text-white font-medium transition-colors duration-300"
                      >
                        {t('planFreeCta')}
                      </Link>
                    </div>

                    {/* Creator Plan */}
                    <div className="bg-[#1A1A1A] rounded-[20px] p-6 border-2 border-[#FFD93B]">
                      <div className="text-center mb-8">
                        <h3 className="text-white text-xl font-bold mb-4">
                          {t('planCreatorName')}
                        </h3>
                        <p className="text-gray-300 text-sm mb-8 whitespace-pre-line leading-relaxed">
                          {t('planCreatorDesc')}
                        </p>
                        <div className="text-[#FFD93B] text-3xl font-bold mb-2">
                          80,000원<span className="text-gray-400 text-lg">/월</span>
                        </div>
                        <p className="text-gray-500 text-sm">
                          100,000원(50% 할인)
                        </p>
                      </div>
                      <ul className="space-y-3 mb-8 text-sm">
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planCreatorFeature1')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planCreatorFeature2')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">{t('planCreatorFeature3')}</span>
                        </li>
                      </ul>
                      <Link
                        href={`/${lang}/billing?plan=basic&billing=${billingCycle}`}
                        className="w-full block text-center rounded-[8px] bg-[#FFD93B] hover:bg-[#FFD93B]/90 text-black px-6 py-3 font-medium transition-colors duration-300"
                      >
                        {t('planCreatorCta')}
                      </Link>
                    </div>

                    {/* Professional Plan */}
                    <div className="bg-[#1A1A1A] rounded-[20px] p-6 border-2 border-[#FFD93B]">
                      <div className="text-center mb-8">
                        <h3 className="text-white text-xl font-bold mb-4">
                          {t('planProfessionalName')}
                        </h3>
                        <p className="text-gray-300 text-sm mb-8 whitespace-pre-line leading-relaxed">
                          {t('planProfessionalDesc')}
                        </p>
                        <div className="text-[#FFD93B] text-3xl font-bold mb-2">
                          {currency}
                          {formatPrice(
                            billingCycle === 'yearly'
                              ? getYearlyMonthlyPrice('PROFESSIONAL')
                              : getPrice('PROFESSIONAL', 'monthly')
                          )}
                          <span className="text-gray-400 text-lg">/월</span>
                        </div>
                        {billingCycle === 'yearly' && (
                          <p className="text-gray-500 text-sm">
                            연간 결제시 20% 할인!
                          </p>
                        )}
                      </div>
                      <ul className="space-y-3 mb-8 text-sm">
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">월 12,000 크레딧</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">우선 생성 속도</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">워터마크 없음</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">무제한 크레딧 이월</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <Check className="text-[#FFD93B] w-4 h-4 flex-shrink-0" />
                          <span className="text-gray-300">추가 크레딧 구매</span>
                        </li>
                      </ul>
                      <Link
                        href={`/${lang}/billing?plan=pro&billing=${billingCycle}`}
                        className="w-full block text-center rounded-[8px] bg-[#FFD93B] hover:bg-[#FFD93B]/90 text-black px-6 py-3 font-medium transition-colors duration-300"
                      >
                        {t('planProfessionalCta')}
                      </Link>
                    </div>
                  </div>
                )}
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
              <div className="bg-gradient-to-r from-[#FFD93B] to-[#F2DC8D] text-black p-12 rounded-3xl max-w-6xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left side - Title */}
                  <div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      CONTACT US.
                    </h2>
                    <p className="text-xl font-medium">
                      {t('sectionContactTitle')}
                    </p>
                  </div>

                  {/* Right side - Form */}
                  <div>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t('contactFormEmail')}
                          className="w-full px-6 py-4 rounded-full text-lg border-0 focus:outline-none focus:ring-4 focus:ring-black/20"
                          required
                        />
                      </div>
                      <div>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={t('contactFormMessage')}
                          rows={4}
                          className="w-full px-6 py-4 rounded-2xl text-lg border-0 focus:outline-none focus:ring-4 focus:ring-black/20 resize-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-black text-[#FFD93B] px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-colors duration-300"
                      >
                        {t('contactFormSubmit')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </PageSection>
        </div>
      </main>
    </>
  );
}
