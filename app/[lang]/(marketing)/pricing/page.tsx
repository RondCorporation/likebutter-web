import initTranslations from '@/lib/i18n-server';
import PricingClient from './_components/PricingClient';
import nextI18NextConfig from '../../../../next-i18next.config.mjs';
import { getPlans, getSubscriptions } from '@/app/_lib/apis/subscription.api';
import { Plan } from '@/app/_types/plan';
import { Subscription } from '@/app/_types/subscription';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ lang: string }>;
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

export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  // Fetch plans and subscriptions in parallel
  const [{ data: apiPlans }, { data: userSubscriptions }] = await Promise.all([
    getPlans().catch(() => ({ data: [] })),
    getSubscriptions().catch(() => ({ data: [] })),
  ]);

  const activeSubscription =
    userSubscriptions?.find((sub) => sub.status === 'ACTIVE') || null;

  const processedPlans = processApiPlans(apiPlans || []);

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
    {
      category: t('featureCategoryCore'),
      name: t('featureGenSpeed'),
      values: {
        [t('planFreeName')]: t('valueStandard'),
        [t('planCreatorName')]: t('valueFast'),
        [t('planProfessionalName')]: t('valueFast'),
        [t('planEnterpriseName')]: t('valuePriority'),
      },
    },
    {
      category: t('featureCategoryCore'),
      name: t('featureWatermark'),
      values: {
        [t('planFreeName')]: true,
        [t('planCreatorName')]: false,
        [t('planProfessionalName')]: false,
        [t('planEnterpriseName')]: false,
      },
    },
    {
      category: t('featureCategoryCore'),
      name: t('featureCreditRollover'),
      values: {
        [t('planFreeName')]: false,
        [t('planCreatorName')]: true,
        [t('planProfessionalName')]: true,
        [t('planEnterpriseName')]: true,
      },
    },
    {
      category: t('featureCategoryCore'),
      name: t('featureExtraCredits'),
      values: {
        [t('planFreeName')]: false,
        [t('planCreatorName')]: true,
        [t('planProfessionalName')]: true,
        [t('planEnterpriseName')]: true,
      },
    },
    {
      category: t('featureCategoryUsage'),
      name: t('featureChatTokens'),
      values: {
        [t('planFreeName')]: t('valueUpTo3000'),
        [t('planCreatorName')]: t('valueUpTo40000'),
        [t('planProfessionalName')]: t('valueUpTo120000'),
        [t('planEnterpriseName')]: t('valueCustom'),
      },
    },
    {
      category: t('featureCategoryUsage'),
      name: t('featureImageGens'),
      values: {
        [t('planFreeName')]: t('valueUpTo30'),
        [t('planCreatorName')]: t('valueUpTo400'),
        [t('planProfessionalName')]: t('valueUpTo1200'),
        [t('planEnterpriseName')]: t('valueCustom'),
      },
    },
    {
      category: t('featureCategoryUsage'),
      name: t('featureVideoSecs'),
      values: {
        [t('planFreeName')]: t('valueUpTo7s'),
        [t('planCreatorName')]: t('valueUpTo100s'),
        [t('planProfessionalName')]: t('valueUpTo300s'),
        [t('planEnterpriseName')]: t('valueCustom'),
      },
    },
    {
      category: t('featureCategoryUsage'),
      name: t('featureCoverGens'),
      values: {
        [t('planFreeName')]: t('valueUpTo6'),
        [t('planCreatorName')]: t('valueUpTo20'),
        [t('planProfessionalName')]: t('valueUpTo80'),
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
      activeSubscription={activeSubscription}
    />
  );
}
