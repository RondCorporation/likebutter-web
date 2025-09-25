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
    BASIC: t('billing:plans.creator.name'),
    STANDARD: t('billing:plans.professional.name'),
  };

  const planDescMap: { [key: string]: string } = {
    BASIC: t('billing:plans.creator.basicDesc'),
    STANDARD: t('billing:plans.professional.advancedDesc'),
  };

  const featuresMap: { [key: string]: string[] } = {
    BASIC: [
      t('billing:plans.creator.attendanceCredit'),
      t('billing:plans.creator.extraCredits'),
    ],
    STANDARD: [
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
        isPopular: planType === 'BASIC',
        isPremium: planType === 'STANDARD',

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

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          (planParam === 'basic' && p.key === 'BASIC') ||
          (planParam === 'standard' && p.key === 'STANDARD') ||
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
      <div className="min-h-screen" style={{ backgroundColor: '#202020' }}>
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Studio Style Header */}
          <div className="text-center mb-12 relative">
            <button
              onClick={() => router.push(`/${lang}/studio`)}
              className="absolute top-0 left-0 inline-flex items-center text-slate-400 hover:text-butter-yellow mb-8 transition-colors group"
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

            <h1 className="text-4xl font-bold text-white mb-4">
              {t('choosePlan')}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              {t('selectPlanDescription')}
            </p>
          </div>

          {/* Studio Style Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-butter-yellow text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-butter-yellow text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('yearly')}
                <span className="ml-2 text-xs text-green-400 font-semibold">
                  20% off
                </span>
              </button>
            </div>
          </div>

          {/* Clean Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div key={plan.key}>
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
                  isPopular={plan.isPopular}
                  isPremium={plan.isPremium}
                  onSelect={handlePlanSelect}
                  loading={loading}
                />
              </div>
            ))}
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
