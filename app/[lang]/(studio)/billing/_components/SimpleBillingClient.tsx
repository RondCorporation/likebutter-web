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
const convertPlansFormat = (apiPlans: Plan[], currency: string, t: any): SimplePlan[] => {
  const planTypeMap: { [key: string]: string } = {
    'CREATOR': 'planCreatorName',
    'PROFESSIONAL': 'planProfessionalName'
  };

  const planDescMap: { [key: string]: string } = {
    'CREATOR': 'planCreatorDesc', 
    'PROFESSIONAL': 'planProfessionalDesc'
  };

  const featuresMap: { [key: string]: string[] } = {
    'CREATOR': ['pricingFeature1', 'pricingFeature2', 'pricingFeature3'],
    'PROFESSIONAL': ['pricingFeature1', 'pricingFeature2', 'pricingFeature3', 'pricingFeature4']
  };

  const processedPlans: { [key: string]: { monthly?: Plan; yearly?: Plan } } = {};
  
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
      name: t('planFreeName'),
      description: t('planFreeDesc'),
      priceMonthly: 'Free',
      priceYearly: 'Free',
      features: [
        t('planFreeFeature1'),
        t('planFreeFeature2'), 
        t('planFreeFeature3')
      ],
      isPopular: false,
      cta: t('planFreeCta')
    }
  ];

  Object.entries(processedPlans).forEach(([planType, cycles]) => {
    if (cycles.monthly || cycles.yearly) {
      const isKorean = currency === '₩';
      const monthlyPrice = cycles.monthly ? (isKorean ? cycles.monthly.priceKrw : cycles.monthly.priceUsd) : 0;
      const yearlyPrice = cycles.yearly ? (isKorean ? cycles.yearly.priceKrw : cycles.yearly.priceUsd) : 0;
      const yearlyMonthlyPrice = yearlyPrice > 0 ? Math.floor(yearlyPrice / 12) : 0;

      result.push({
        key: planType.toLowerCase(),
        name: t(planTypeMap[planType] || planType),
        description: t(planDescMap[planType] || `${planType} plan`),
        priceMonthly: monthlyPrice as number | string,
        priceYearly: yearlyMonthlyPrice as number | string,
        features: (featuresMap[planType] || []).map(featureKey => t(featureKey)),
        isPopular: planType === 'CREATOR',
        cta: t('planCreatorCta')
      });
    }
  });

  return result;
};

export default function SimpleBillingClient({ 
  lang, 
  plans: apiPlans, 
  currency 
}: SimpleBillingClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const plans = convertPlansFormat(apiPlans, currency, t);

  const handlePlanSelect = async (planKey: string, billingCycle: 'monthly' | 'yearly') => {
    if (planKey === 'free') {
      router.push(`/${lang}/signup`);
      return;
    }

    setLoading(true);
    
    try {
      // For now, just show a toast. In real implementation, this would handle payment
      toast.success(`${planKey} ${billingCycle} 플랜을 선택하셨습니다.`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to checkout or success page
      router.push(`/${lang}/billing?plan=${planKey}&billing=${billingCycle}`);
    } catch (error) {
      toast.error('플랜 선택 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudioOverlay 
      title="요금제 선택" 
      backUrl={`/${lang}/studio/history`}
    >
      <SimplePricingView
        plans={plans}
        onPlanSelect={handlePlanSelect}
        loading={loading}
      />
    </StudioOverlay>
  );
}