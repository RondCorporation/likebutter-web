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

// Reusable Page Section Component
const PageSection = ({
  children,
  className = '',
  id,
  noPadding = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  noPadding?: boolean;
  style?: React.CSSProperties;
}) => {
  return (
    <section id={id} className={className} style={style}>
      {noPadding ? (
        children
      ) : (
        <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
          {children}
        </div>
      )}
    </section>
  );
};

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
          <PageSection id="about" className="bg-black text-white py-32">
            <div>
              <div className="max-w-4xl mb-8">
                <p className="text-[#FFD93B] text-lg font-medium mb-4 tracking-wide">
                  ABOUT LIKE BUTTER.
                </p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  {t('sectionAboutTitle')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                </h2>
                <p className="text-xl text-white/80 leading-relaxed">
                  {t('sectionAboutDesc')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                </p>
              </div>

              {/* Cards Section */}
              <div className="mt-24">
                <div className="flex justify-end items-end gap-8">
                  {/* Card 1 - Butter Talks */}
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src="/card-1.png"
                      alt="Butter Talks"
                      width={300}
                      height={400}
                      className="rounded-2xl shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Card 2 - Butter Cover */}
                  <div className="transform transition-transform duration-300 hover:scale-105 -translate-y-8">
                    <Image
                      src="/card-2.png"
                      alt="Butter Cover"
                      width={300}
                      height={400}
                      className="rounded-2xl shadow-2xl"
                      priority
                    />
                  </div>

                  {/* Card 3 - Butter Brush */}
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <Image
                      src="/card-3.png"
                      alt="Butter Brush"
                      width={300}
                      height={400}
                      className="rounded-2xl shadow-2xl"
                      priority
                    />
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
            id="demo"
            className="relative text-white py-32 overflow-hidden"
            style={{ backgroundColor: '#131313' }}
            noPadding
          >
            <div className="relative container mx-auto px-4 sm:px-6 max-w-screen-xl h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start h-full">
                <div className="max-w-lg">
                  <p className="text-[#FFD93B] text-lg font-medium mb-4 tracking-wide">
                    LIVE DEMO.
                  </p>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    {t('sectionDemoTitle')
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>
                          {line}
                          {i === 0 && <br />}
                        </span>
                      ))}
                  </h2>
                  <p className="text-xl text-white/80 leading-relaxed">
                    {t('sectionDemoDesc')
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>
                          {line}
                          {i === 0 && <br />}
                        </span>
                      ))}
                  </p>
                </div>

                {/* Mobile Mockup Placeholder - positioned to overlap with gradient */}                <div className="relative lg:self-end">
                  <div
                    className="rounded-2xl aspect-[9/16] max-w-sm mx-auto flex items-center justify-center border border-gray-600 shadow-2xl transform translate-y-16"
                    style={{ backgroundColor: '#2a2a2a' }}
                  >
                    <div className="text-center text-gray-500">
                      <h3 className="text-2xl font-bold mb-2 text-gray-400">
                        COMING SOON
                      </h3>
                      <p className="text-sm">{t('sectionDemoComingSoon')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlay on top of all content */}            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-10 pointer-events-none"
              aria-hidden="true"
            />          </PageSection>
        </div>

        {/* Section 4: Pricing */}
        <div
          ref={(el) => {
            sectionRefs.current[3] = el;
          }}
          data-section-index={3}
        >
          <PageSection id="pricing" className="bg-black text-white py-32">
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <p className="text-[#FFD93B] text-lg font-medium mb-4 tracking-wide">
                  PLAN.
                </p>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  {t('sectionPricingTitle')
                    .split('\n')
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                </h2>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-12">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Free Plan */}
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">
                        {t('planFreeName')}
                      </h3>
                      <p className="text-gray-400 mb-6">{t('planFreeDesc')}</p>
                      <div className="text-5xl font-bold text-[#FFD93B]">
                        Free<span className="text-lg text-gray-400">/월</span>
                      </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>월 300 크레딧</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>표준 속도</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>워터마크 포함</span>
                      </li>
                    </ul>
                    <Link
                      href={`/${lang}/signup`}
                      className="w-full block text-center rounded-full bg-gray-600 hover:bg-gray-500 px-8 py-4 text-lg font-bold transition-colors duration-300"
                    >
                      {t('planFreeCta')}
                    </Link>
                  </div>

                  {/* Creator Plan */}
                  <div className="bg-gray-800 rounded-2xl p-8 border-2 border-[#FFD93B] relative overflow-hidden scale-105">
                    <div className="absolute top-4 right-4 bg-[#FFD93B] text-black px-3 py-1 rounded-full text-sm font-bold">
                      추천
                    </div>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">
                        {t('planCreatorName')}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {t('planCreatorDesc')}
                      </p>
                      <div className="text-5xl font-bold text-[#FFD93B]">
                        {currency}
                        {formatPrice(
                          billingCycle === 'yearly'
                            ? getYearlyMonthlyPrice('CREATOR')
                            : getPrice('CREATOR', 'monthly')
                        )}
                        <span className="text-lg text-gray-400">/월</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-400 mt-2">
                          연간 결제시 20% 할인!
                        </p>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>월 4,000 크레딧</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>빠른 생성 속도</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>워터마크 없음</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>크레딧 이월</span>
                      </li>
                    </ul>
                    <Link
                      href={`/${lang}/billing?plan=basic&billing=${billingCycle}`}
                      className="w-full block text-center rounded-full bg-[#FFD93B] hover:bg-[#FFD93B]/90 text-black px-8 py-4 text-lg font-bold transition-colors duration-300"
                    >
                      {t('planCreatorCta')}
                    </Link>
                  </div>

                  {/* Professional Plan */}
                  <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-2">
                        {t('planProfessionalName')}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {t('planProfessionalDesc')}
                      </p>
                      <div className="text-5xl font-bold text-[#FFD93B]">
                        {currency}
                        {formatPrice(
                          billingCycle === 'yearly'
                            ? getYearlyMonthlyPrice('PROFESSIONAL')
                            : getPrice('PROFESSIONAL', 'monthly')
                        )}
                        <span className="text-lg text-gray-400">/월</span>
                      </div>
                      {billingCycle === 'yearly' && (
                        <p className="text-sm text-green-400 mt-2">
                          연간 결제시 20% 할인!
                        </p>
                      )}
                    </div>
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>월 12,000 크레딧</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>우선 생성 속도</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>워터마크 없음</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>무제한 크레딧 이월</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Check className="text-[#FFD93B] w-5 h-5" />
                        <span>추가 크레딧 구매</span>
                      </li>
                    </ul>
                    <Link
                      href={`/${lang}/billing?plan=pro&billing=${billingCycle}`}
                      className="w-full block text-center rounded-full bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-bold transition-colors duration-300"
                    >
                      {t('planProfessionalCta')}
                    </Link>
                  </div>
                </div>
              )}

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
          <PageSection className="bg-black text-white py-32">
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
