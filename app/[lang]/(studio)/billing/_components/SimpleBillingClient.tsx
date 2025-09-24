'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import StudioOverlay from '@/components/studio/StudioOverlay';
import SimplePricingView from '@/components/shared/SimplePricingView';
import { Plan } from '@/app/_types/plan';
import toast from 'react-hot-toast';

interface SimpleBillingClientProps {
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
  features: string[];
  isPopular?: boolean;
  cta: string;
}

const convertPlansFormat = (
  apiPlans: Plan[],
  currency: string,
  t: any
): SimplePlan[] => {
  const planTypeMap: { [key: string]: string } = {
    BASIC: 'Basic Plan',
    STANDARD: 'Standard Plan',
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
    ],
  };

  const processedPlans: { [key: string]: { monthly?: Plan; yearly?: Plan } } =
    {};

  apiPlans.forEach((plan) => {
    if (!processedPlans[plan.planType]) {
      processedPlans[plan.planType] = {};
    }
    if (plan.billingCycle === 'MONTHLY') {
      processedPlans[plan.planType].monthly = plan;
    } else if (plan.billingCycle === 'YEARLY') {
      processedPlans[plan.planType].yearly = plan;
    }
  });

  const result: SimplePlan[] = [
    {
      key: 'free',
      name: 'Free Plan',
      description: t('billing:plans.free.desc'),
      priceMonthly: 'Free',
      priceYearly: 'Free',
      features: [t('billing:plans.free.attendanceCredit')],
      isPopular: false,
      cta: t('billing:plans.free.name'),
    },
  ];

  Object.entries(processedPlans).forEach(([planType, cycles]) => {
    if (cycles.monthly || cycles.yearly) {
      const isKorean = currency === '₩';
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
        key: planType.toLowerCase(),
        name: planTypeMap[planType] || planType,
        description: planDescMap[planType] || `${planType} plan`,
        priceMonthly: monthlyPrice as number | string,
        priceYearly: yearlyMonthlyPrice as number | string,
        features: featuresMap[planType] || [],
        isPopular: planType === 'BASIC',
        cta:
          planType === 'BASIC'
            ? t('billing:plans.startButton')
            : t('billing:plans.upgradePlan'),
      });
    }
  });

  return result;
};

export default function SimpleBillingClient({
  lang,
  plans: apiPlans,
  currency,
}: SimpleBillingClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const plans = convertPlansFormat(apiPlans, currency, t);

  const handlePlanSelect = async (
    planKey: string,
    billingCycle: 'monthly' | 'yearly'
  ) => {
    if (planKey === 'free') {
      router.push(`/${lang}/signup`);
      return;
    }

    setLoading(true);

    try {
      toast.success(t('billing:plans.planSelected', { planKey, billingCycle }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push(`/${lang}/billing?plan=${planKey}&billing=${billingCycle}`);
    } catch (error) {
      toast.error(t('billing:plans.planSelectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioOverlay title={t('billing:plans.title')} backUrl={`/${lang}/studio`}>
      <SimplePricingView
        plans={plans}
        onPlanSelect={handlePlanSelect}
        loading={loading}
      />
    </StudioOverlay>
  );
}
