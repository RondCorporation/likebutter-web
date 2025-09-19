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

// Convert API plans to SimplePricingView format
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
    BASIC: '크리에이터를 위한 기본 플랜',
    STANDARD: '프로페셔널을 위한 고급 플랜',
  };

  const featuresMap: { [key: string]: string[] } = {
    BASIC: ['월 3,000 크레딧', '워터마크 없음', '기본 생성 속도'],
    STANDARD: [
      '월 12,000 크레딧',
      '우선 생성 속도',
      '워터마크 없음',
      '무제한 크레딧 이월',
      '추가 크레딧 구매',
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
      description: '무료로 시작하기',
      priceMonthly: 'Free',
      priceYearly: 'Free',
      features: ['월 500 크레딧', '워터마크 포함', '기본 생성 속도'],
      isPopular: false,
      cta: '무료 시작',
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
        cta: planType === 'BASIC' ? '시작하기' : '업그레이드',
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
      // For now, just show a toast. In real implementation, this would handle payment
      toast.success(`${planKey} ${billingCycle} 플랜을 선택하셨습니다.`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to checkout or success page
      router.push(`/${lang}/billing?plan=${planKey}&billing=${billingCycle}`);
    } catch (error) {
      toast.error('플랜 선택 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioOverlay title="요금제 선택" backUrl={`/${lang}/studio`}>
      <SimplePricingView
        plans={plans}
        onPlanSelect={handlePlanSelect}
        loading={loading}
      />
    </StudioOverlay>
  );
}
