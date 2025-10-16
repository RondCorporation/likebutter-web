'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import ModernPlanCard from './ModernPlanCard';
import StudioCheckoutModal from './StudioCheckoutModal';
import BillingLoadingSkeleton from './BillingLoadingSkeleton';
import BillingErrorDisplay from './BillingErrorDisplay';
import { Plan } from '@/app/_types/plan';
import { useAuthStore } from '@/stores/authStore';
import { getMySubscription } from '@/lib/apis/subscription.api';
import { SubscriptionDetails } from '@/app/_types/subscription';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface BillingDashboardProps {
  lang: string;
  plans: Plan[];
  currency: string;
}

interface SimplePlan {
  key: string;
  name: string;
  description: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  features: Array<{ text: string; highlighted?: boolean }>;
  isPopular?: boolean;
  isPremium?: boolean;
  monthlyPlanKey?: string;
  yearlyPlanKey?: string;
}

const convertPlansFormat = (
  apiPlans: Plan[],
  currency: string,
  t: any
): SimplePlan[] => {
  const planTypeMap: { [key: string]: string } = {
    CREATOR: t('billing:plans.creator.name'),
    PROFESSIONAL: t('billing:plans.professional.name'),
  };

  const planDescMap: { [key: string]: string } = {
    CREATOR: t('billing:plans.creator.basicDesc'),
    PROFESSIONAL: t('billing:plans.professional.advancedDesc'),
  };

  const featuresMap: { [key: string]: string[] } = {
    CREATOR: [
      t('billing:plans.creator.attendanceCredit'),
      t('billing:plans.creator.extraCredits'),
    ],
    PROFESSIONAL: [
      t('billing:plans.professional.attendanceCredit'),
      t('billing:plans.professional.extraCredits'),
      t('billing:plans.professional.features.creditRollover'),
    ],
  };

  const result: SimplePlan[] = [
    {
      key: 'FREE',
      name: 'Free Plan',
      description: t('billing:plans.free.desc'),
      priceMonthly: 'Free',
      priceYearly: 'Free',
      features: [{ text: t('billing:plans.free.attendanceCredit') }],
      isPopular: false,
    },
  ];

  const isKorean = currency === '₩';

  const processedPlans: { [key: string]: { monthly?: Plan; yearly?: Plan } } =
    {};

  apiPlans.forEach((plan) => {
    if (plan.planType !== 'ENTERPRISE' && plan.planKey !== 'FREE') {
      if (!processedPlans[plan.planType]) {
        processedPlans[plan.planType] = {};
      }
      if (plan.billingCycle === 'MONTHLY') {
        processedPlans[plan.planType].monthly = plan;
      } else if (plan.billingCycle === 'YEARLY') {
        processedPlans[plan.planType].yearly = plan;
      }
    }
  });

  Object.entries(processedPlans).forEach(([planType, cycles]) => {
    if (cycles.monthly || cycles.yearly) {
      const monthlyPrice = cycles.monthly
        ? isKorean
          ? cycles.monthly.priceKrw || 0
          : cycles.monthly.priceUsd || 0
        : 0;
      const yearlyPrice = cycles.yearly
        ? isKorean
          ? cycles.yearly.priceKrw || 0
          : cycles.yearly.priceUsd || 0
        : 0;
      const yearlyMonthlyPrice =
        yearlyPrice > 0 ? Math.floor(yearlyPrice / 12) : 0;

      result.push({
        key: planType,
        name: planTypeMap[planType] || planType,
        description: planDescMap[planType] || `${planType} plan`,
        priceMonthly: monthlyPrice,
        priceYearly: yearlyMonthlyPrice,
        features: (featuresMap[planType] || []).map((featureText, index) => ({
          text: featureText,
          highlighted: index === 0,
        })),
        isPopular: planType === 'CREATOR',
        isPremium: planType === 'PROFESSIONAL',

        monthlyPlanKey: cycles.monthly?.planKey,
        yearlyPlanKey: cycles.yearly?.planKey,
      });
    }
  });

  return result;
};

export default function BillingDashboard({
  lang,
  plans: apiPlans,
  currency,
}: BillingDashboardProps) {
  const { t } = useTranslation(['billing', 'common']);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const isMobile = useIsMobile();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionDetails | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await getMySubscription();
        if (res.data) {
          setCurrentSubscription(res.data);
        }
      } catch (err) {
        // User might not have a subscription, that's ok
      }
    };

    fetchSubscription();

    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      if (!apiPlans || apiPlans.length === 0) {
        setError('planDataNotAvailable');
        return;
      }

      const hasValidPlans = apiPlans.some(
        (plan) =>
          plan.planType && plan.billingCycle && (plan.priceKrw || plan.priceUsd)
      );

      if (!hasValidPlans) {
        setError('invalidPlanData');
        return;
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'unknownError');
    }
  }, [apiPlans]);

  const plans = useMemo(
    () => convertPlansFormat(apiPlans, currency, t),
    [apiPlans, currency, t]
  );

  const handlePlanSelect = useCallback(
    (planKey: string, cycle: 'monthly' | 'yearly') => {
      if (planKey === 'FREE') {
        router.push(`/${lang}/signup`);
        return;
      }

      const plan = plans.find((p) => p.key === planKey);
      if (!plan) return;

      const actualPlanKey =
        cycle === 'monthly' ? plan.monthlyPlanKey : plan.yearlyPlanKey;
      if (!actualPlanKey) return;

      const price =
        cycle === 'monthly'
          ? plan.priceMonthly
          : (plan.priceYearly as number) * 12;
      const originalPrice =
        cycle === 'yearly' ? (plan.priceMonthly as number) * 12 : undefined;

      setSelectedPlan({
        planKey: actualPlanKey,
        name: plan.name,
        description: plan.description,
        price: price as number,
        originalPrice,
        currency,
        billingCycle: cycle,
        features: plan.features.map((f) => f.text),
      });

      setShowCheckoutModal(true);
    },
    [plans, router, lang, currency]
  );

  useEffect(() => {
    const planParam = searchParams.get('plan');
    const billingParam = searchParams.get('billing') as 'monthly' | 'yearly';

    if (planParam && billingParam && plans.length > 0) {
      setBillingCycle(billingParam);

      const plan = plans.find(
        (p) =>
          (planParam === 'creator' && p.key === 'CREATOR') ||
          (planParam === 'professional' && p.key === 'PROFESSIONAL') ||
          p.key === planParam
      );

      if (plan && plan.key !== 'FREE') {
        handlePlanSelect(plan.key, billingParam);
      }
    }
  }, [searchParams, plans, handlePlanSelect]);

  const handleCloseModal = () => {
    setShowCheckoutModal(false);
    setSelectedPlan(null);

    const url = new URL(window.location.href);
    url.searchParams.delete('plan');
    url.searchParams.delete('billing');
    router.replace(url.pathname, { scroll: false });
  };

  const handleRetry = () => {
    setError(null);
    setIsInitialLoading(true);

    setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
  };

  if (isInitialLoading) {
    return <BillingLoadingSkeleton lang={lang} />;
  }

  if (error) {
    return (
      <BillingErrorDisplay
        lang={lang}
        error={error}
        onRetry={handleRetry}
        onBack={() => router.push(`/${lang}/studio`)}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen h-dvh-fallback md:h-auto overflow-y-auto" style={{ backgroundColor: '#202020' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
          {/* Back to Studio Button - Mobile: separate row, Desktop: absolute */}
          <div className="mb-6 md:mb-0">
            <button
              onClick={() => router.push(`/${lang}/studio`)}
              className="inline-flex items-center text-slate-400 hover:text-butter-yellow transition-colors group"
            >
              <svg
                className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t('backToStudio')}
            </button>
          </div>

          {/* Studio Style Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 md:mb-4">
              {currentSubscription ? t('upgradePlan') : t('choosePlan')}
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
              {currentSubscription
                ? t('upgradeDescription', {
                    currentPlan:
                      currentSubscription.planInfo.planKey ===
                        'CREATOR_MONTHLY' ||
                      currentSubscription.planInfo.planKey === 'CREATOR_YEARLY'
                        ? t('billing:plans.creator.name')
                        : currentSubscription.planInfo.planKey ===
                              'PROFESSIONAL_MONTHLY' ||
                            currentSubscription.planInfo.planKey ===
                              'PROFESSIONAL_YEARLY'
                          ? t('billing:plans.professional.name')
                          : 'Free Plan',
                  })
                : t('selectPlanDescription')}
            </p>
          </div>

          {/* Studio Style Billing Toggle */}
          {!currentSubscription ||
          (currentSubscription.planInfo.planKey !== 'CREATOR_MONTHLY' &&
            currentSubscription.planInfo.planKey !== 'CREATOR_YEARLY') ? (
            <div className="flex justify-center mb-8 md:mb-12">
              <div
                className="inline-flex rounded-lg p-1 border border-slate-700"
                style={{ backgroundColor: '#25282c' }}
              >
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    billingCycle === 'monthly'
                      ? 'bg-butter-yellow text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('monthly')}
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    billingCycle === 'yearly'
                      ? 'bg-butter-yellow text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('yearly')}
                  <span className="ml-1 sm:ml-2 text-xs text-green-400 font-semibold">
                    20% off
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8 md:mb-12"></div>
          )}

          {/* Clean Plan Cards */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
            {(() => {
              // Special handling for Creator plan users
              if (
                currentSubscription &&
                (currentSubscription.planInfo.planKey === 'CREATOR_MONTHLY' ||
                  currentSubscription.planInfo.planKey === 'CREATOR_YEARLY')
              ) {
                const currentCycle =
                  currentSubscription.planInfo.planKey.includes('MONTHLY')
                    ? 'monthly'
                    : 'yearly';
                const creatorPlan = plans.find((p) => p.key === 'CREATOR');
                const professionalPlan = plans.find(
                  (p) => p.key === 'PROFESSIONAL'
                );

                const cardsToRender = [];

                // Current Creator plan
                if (creatorPlan) {
                  cardsToRender.push({
                    ...creatorPlan,
                    renderCycle: currentCycle,
                    isCurrentPlan: true,
                    uniqueKey: `CREATOR-${currentCycle}`,
                  });
                }

                // Professional Monthly
                if (professionalPlan) {
                  cardsToRender.push({
                    ...professionalPlan,
                    renderCycle: 'monthly',
                    isCurrentPlan: false,
                    uniqueKey: 'PROFESSIONAL-monthly',
                  });
                }

                // Professional Yearly
                if (professionalPlan) {
                  cardsToRender.push({
                    ...professionalPlan,
                    renderCycle: 'yearly',
                    isCurrentPlan: false,
                    uniqueKey: 'PROFESSIONAL-yearly',
                  });
                }

                return cardsToRender.map((planCard) => {
                  const cycleLabel =
                    planCard.renderCycle === 'monthly'
                      ? t('monthly')
                      : t('yearly');
                  const actualPlanKey =
                    planCard.renderCycle === 'monthly'
                      ? planCard.monthlyPlanKey
                      : planCard.yearlyPlanKey;

                  return (
                    <div
                      key={planCard.uniqueKey}
                      className={`w-full md:w-auto md:flex-1 md:max-w-sm ${planCard.isCurrentPlan ? 'opacity-50' : ''}`}
                    >
                      <ModernPlanCard
                        planKey={planCard.key}
                        name={`${planCard.name} (${cycleLabel})`}
                        description={planCard.description}
                        price={
                          planCard.renderCycle === 'monthly'
                            ? planCard.priceMonthly
                            : planCard.priceYearly
                        }
                        originalPrice={
                          planCard.renderCycle === 'yearly' &&
                          typeof planCard.priceMonthly === 'number'
                            ? planCard.priceMonthly * 12
                            : undefined
                        }
                        currency={currency}
                        billingCycle={
                          planCard.renderCycle as 'monthly' | 'yearly'
                        }
                        features={planCard.features}
                        isPopular={false}
                        isPremium={planCard.isPremium}
                        onSelect={
                          planCard.isCurrentPlan ? () => {} : handlePlanSelect
                        }
                        loading={loading}
                        isCurrentPlan={planCard.isCurrentPlan}
                      />
                    </div>
                  );
                });
              }

              // Default rendering for other cases
              return plans
                .filter((plan) => {
                  // Hide FREE plan on mobile
                  if (isMobile && plan.key === 'FREE') {
                    return false;
                  }

                  if (!currentSubscription) return true;

                  const currentPlanKey = currentSubscription.planInfo.planKey;

                  // If Professional plan, hide FREE and CREATOR
                  if (
                    currentPlanKey === 'PROFESSIONAL_MONTHLY' ||
                    currentPlanKey === 'PROFESSIONAL_YEARLY'
                  ) {
                    return plan.key === 'PROFESSIONAL';
                  }

                  return true;
                })
                .map((plan) => {
                  const isCurrentPlan =
                    currentSubscription &&
                    ((currentSubscription.planInfo.planKey ===
                      'CREATOR_MONTHLY' &&
                      plan.key === 'CREATOR') ||
                      (currentSubscription.planInfo.planKey ===
                        'CREATOR_YEARLY' &&
                        plan.key === 'CREATOR') ||
                      (currentSubscription.planInfo.planKey ===
                        'PROFESSIONAL_MONTHLY' &&
                        plan.key === 'PROFESSIONAL') ||
                      (currentSubscription.planInfo.planKey ===
                        'PROFESSIONAL_YEARLY' &&
                        plan.key === 'PROFESSIONAL') ||
                      (currentSubscription.planInfo.planKey === 'FREE' &&
                        plan.key === 'FREE'));

                  return (
                    <div
                      key={plan.key}
                      className={`w-full md:w-auto md:flex-1 md:max-w-sm ${isCurrentPlan ? 'opacity-50' : ''}`}
                    >
                      <ModernPlanCard
                        planKey={plan.key}
                        name={plan.name}
                        description={plan.description}
                        price={
                          billingCycle === 'monthly'
                            ? plan.priceMonthly
                            : plan.priceYearly
                        }
                        originalPrice={
                          billingCycle === 'yearly' &&
                          typeof plan.priceMonthly === 'number'
                            ? plan.priceMonthly * 12
                            : undefined
                        }
                        currency={currency}
                        billingCycle={billingCycle}
                        features={plan.features}
                        isPopular={!currentSubscription && plan.isPopular}
                        isPremium={plan.isPremium}
                        onSelect={isCurrentPlan ? () => {} : handlePlanSelect}
                        loading={loading}
                        isCurrentPlan={!!isCurrentPlan}
                      />
                    </div>
                  );
                });
            })()}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPlan && (
        <StudioCheckoutModal
          isOpen={showCheckoutModal}
          onClose={handleCloseModal}
          plan={selectedPlan}
          lang={lang}
        />
      )}
    </>
  );
}
