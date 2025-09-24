'use client';

import { useState } from 'react';
import PricingCard from './PricingCard';
import StudioToolCard from './StudioToolCard';
import { useTranslation } from 'react-i18next';

interface Plan {
  key: string;
  name: string;
  description: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

interface SimplePricingViewProps {
  plans: Plan[];
  onPlanSelect: (planKey: string, billingCycle: 'monthly' | 'yearly') => void;
  currentPlanKey?: string;
  loading?: boolean;
}

export default function SimplePricingView({
  plans,
  onPlanSelect,
  currentPlanKey,
  loading = false,
}: SimplePricingViewProps) {
  const { t } = useTranslation(['billing']);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );

  const handlePlanSelect = (planKey: string) => {
    onPlanSelect(planKey, billingCycle);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <StudioToolCard>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('plans.title')}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t('plans.subtitle')}
          </p>
        </div>
      </StudioToolCard>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-slate-800 rounded-full p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-butter-yellow text-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('plans.monthlyBilling')}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-butter-yellow text-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            {t('plans.yearlyBilling')}{' '}
            <span className="text-xs opacity-75">(-20%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price =
            billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isCurrentPlan = currentPlanKey === plan.key;

          return (
            <PricingCard
              key={plan.key}
              name={plan.name}
              description={plan.description}
              price={price}
              period={t('plans.month')}
              features={plan.features}
              isPopular={plan.isPopular}
              isCurrentPlan={isCurrentPlan}
              ctaText={plan.cta}
              onCtaClick={() => handlePlanSelect(plan.key)}
              disabled={loading}
            />
          );
        })}
      </div>

      {/* Additional Info */}
      <StudioToolCard className="text-center">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            {t('plans.allPlansInclude')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-butter-yellow rounded-full"></div>
              {t('plans.freeTrial')}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-butter-yellow rounded-full"></div>
              {t('plans.support247')}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-butter-yellow rounded-full"></div>
              {t('plans.cancelAnytime')}
            </div>
          </div>
        </div>
      </StudioToolCard>
    </div>
  );
}
