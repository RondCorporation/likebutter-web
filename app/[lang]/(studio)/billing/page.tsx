import { redirect } from 'next/navigation';
import initTranslations from '@/app/_lib/i18n-server';
import PricingClient from './_components/PricingClient';
import CheckoutClient from './_components/CheckoutClient';
import nextI18NextConfig from '../../../../next-i18next.config.mjs';
import { getPlansOnServer } from '@/app/_lib/apis/subscription.api.server';
import { Plan } from '@/app/_types/plan';

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export function generateStaticParams() {
  return nextI18NextConfig.i18n.locales.map((locale) => ({ lang: locale }));
}

const processApiPlans = (apiPlans: Plan[]) => {
  const processed: {
    [key: string]: {
      monthly?: Plan;
      yearly?: Plan;
    };
  } = {};

  apiPlans.forEach((plan) => {
    if (!processed[plan.planType]) {
      processed[plan.planType] = {};
    }
    if (plan.billingCycle === 'MONTHLY') {
      processed[plan.planType].monthly = plan;
    } else if (plan.billingCycle === 'YEARLY') {
      processed[plan.planType].yearly = plan;
    }
  });
  return processed;
};

const PLAN_MAP: { [key: string]: string } = {
  basic: 'CREATOR',
  pro: 'PROFESSIONAL',
};

const PLAN_FEATURES_MAP: { [key: string]: string[] } = {
  CREATOR: ['pricingFeature1', 'pricingFeature2', 'pricingFeature3'],
  PROFESSIONAL: [
    'pricingFeature1',
    'pricingFeature2',
    'pricingFeature3',
    'pricingFeature4',
  ],
};

export default async function BillingPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const resolvedSearchParams = await searchParams;
  
  
  const { t } = await initTranslations(lang, ['common']);

  const { data: apiPlans } = (await getPlansOnServer().catch(() => ({
    data: [],
  }))) || { data: [] };
  const processedPlans = processApiPlans(apiPlans || []);

  const planQuery = resolvedSearchParams?.plan as string;
  if (planQuery) {
    const billingCycleQuery =
      (resolvedSearchParams?.billing as string) || 'monthly';
    const planType = PLAN_MAP[planQuery];
    const planData =
      billingCycleQuery === 'yearly'
        ? processedPlans[planType]?.yearly
        : processedPlans[planType]?.monthly;

    if (!planData) {
      return redirect(`/${lang}/billing`);
    }

    const isKorean = lang === 'ko';
    const currency = isKorean ? '₩' : '$';
    const price = isKorean ? planData.priceKrw : planData.priceUsd;
    const pricePerMonth =
      billingCycleQuery === 'yearly' && planData.pricePerMonth
        ? isKorean
          ? planData.pricePerMonth.krw
          : planData.pricePerMonth.usd
        : price;

    const priceFormatted =
      billingCycleQuery === 'yearly'
        ? `${currency}${pricePerMonth.toLocaleString(
            isKorean ? 'ko-KR' : 'en-US'
          )}/mo`
        : `${currency}${price.toLocaleString(isKorean ? 'ko-KR' : 'en-US')}/mo`;

    const planForCheckout = {
      name: t(
        planType === 'CREATOR' ? 'planCreatorName' : 'planProfessionalName'
      ),
      priceFormatted,
      features: PLAN_FEATURES_MAP[planType].map((featureKey) => t(featureKey)),
      planKey: planData.planKey,
    };

    return <CheckoutClient lang={lang} plan={planForCheckout} />;
  }

  const isKorean = lang === 'ko';
  const currency = isKorean ? '₩' : '$';
  const getPrice = (planType: string, cycle: 'monthly' | 'yearly') => {
    const plan = processedPlans[planType]?.[cycle];
    if (!plan) return 0;
    return isKorean ? plan.priceKrw : plan.priceUsd;
  };

  const getPlanKey = (planType: string, cycle: 'monthly' | 'yearly') => {
    return processedPlans[planType]?.[cycle]?.planKey || '';
  };

  const plans = [
    {
      key: 'Free',
      name: t('planFreeName'),
      description: t('planFreeDesc'),
      priceMonthly: 0,
      priceYearly: 0,
      cta: t('planFreeCta'),
      href: `/${lang}/signup`,
      isPopular: false,
      isCustom: false,
      planKeyMonthly: '',
      planKeyYearly: '',
      priceYearlyTotal: 0,
    },
    {
      key: 'Creator',
      name: t('planCreatorName'),
      description: t('planCreatorDesc'),
      priceMonthly: getPrice('CREATOR', 'monthly'),
      priceYearly: getPrice('CREATOR', 'yearly') / 12,
      cta: t('planCreatorCta'),
      href: '#',
      isPopular: true,
      isCustom: false,
      planKeyMonthly: getPlanKey('CREATOR', 'monthly'),
      planKeyYearly: getPlanKey('CREATOR', 'yearly'),
      priceYearlyTotal: getPrice('CREATOR', 'yearly'),
    },
    {
      key: 'Professional',
      name: t('planProfessionalName'),
      description: t('planProfessionalDesc'),
      priceMonthly: getPrice('PROFESSIONAL', 'monthly'),
      priceYearly: getPrice('PROFESSIONAL', 'yearly') / 12,
      cta: t('planProfessionalCta'),
      href: '#',
      isPopular: false,
      isCustom: false,
      planKeyMonthly: getPlanKey('PROFESSIONAL', 'monthly'),
      planKeyYearly: getPlanKey('PROFESSIONAL', 'yearly'),
      priceYearlyTotal: getPrice('PROFESSIONAL', 'yearly'),
    },
    {
      key: 'Enterprise',
      name: t('planEnterpriseName'),
      description: t('planEnterpriseDesc'),
      priceMonthly: t('planEnterprisePrice'),
      priceYearly: t('planEnterprisePrice'),
      cta: t('planEnterpriseCta'),
      href: 'mailto:enterprise@likebutter.com',
      isPopular: false,
      isCustom: true,
      planKeyMonthly: '',
      planKeyYearly: '',
      priceYearlyTotal: 0,
    },
  ];

  const features = [
    {
      category: t('featureCategoryCore'),
      name: t('featureMonthlyCredits'),
      values: {
        [t('planFreeName')]: t('value300'),
        [t('planCreatorName')]: t('value4000'),
        [t('planProfessionalName')]: t('value12000'),
        [t('planEnterpriseName')]: t('valueCustom'),
      },
    },
  ];

  const translations = {
    title: t('pricingTitle'),
    subtitle: t('pricingSubtitle'),
    monthly: t('monthly'),
    yearly: t('yearly'),
    save20: t('save20'),
    billedAs: t('billedAs'),
    serviceTerms: t('serviceTerms'),
    monthlyBilling: t('monthlyBilling'),
    yearlyBilling: t('yearlyBilling'),
    servicePeriodMonthly: t('servicePeriodMonthly'),
    servicePeriodYearly: t('servicePeriodYearly'),
    autoRenewing: t('autoRenewing'),
    goToStudio: t('goToStudio'),
    paymentAlert: t('paymentAlert'),
    currentPlan: t('currentPlan'),
    downgradeNotAvailable: t('downgradeNotAvailable'),
    upgradePlan: t('upgradePlan'),
    processing: t('processing'),
  };

  return (
    <PricingClient
      lang={lang}
      plans={plans}
      features={features}
      translations={translations}
      currency={currency}
      apiPlans={apiPlans || []}
    />
  );
}
