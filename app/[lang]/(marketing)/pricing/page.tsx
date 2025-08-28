import { Metadata } from 'next';
import initTranslations from '@/app/_lib/i18n-server';
import PricingClient from './_components/PricingClient';
import TranslationsProvider from '@/app/_components/TranslationsProvider';
import { getPlansOnServer } from '@/app/_lib/apis/subscription.api.server';
import { Plan } from '@/app/_types/plan';

// 1. Revert Props type for params to be a Promise
type Props = {
  params: Promise<{ lang: string }>;
};

// 2. Add await when accessing params
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);
  return {
    title: t('pricingTitle'),
    description: t('pricingSubtitle'),
  };
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

// 3. Add await when accessing params
export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  const { t, resources } = await initTranslations(lang, ['common']);

  const { data: apiPlans } = (await getPlansOnServer().catch(() => ({
    data: [],
  }))) || { data: [] };
  const processedPlans = processApiPlans(apiPlans || []);

  const isKorean = lang === 'ko';
  const currency = isKorean ? '₩' : '$';

  const getPrice = (plan: Plan | undefined) => {
    if (!plan) return { price: 0, priceFormatted: t('pricingContactUs') };
    const price = isKorean ? plan.priceKrw : plan.priceUsd;
    return {
      price,
      priceFormatted: `${currency}${price.toLocaleString(
        isKorean ? 'ko-KR' : 'en-US',
      )}`,
    };
  };

  const creatorMonthly = processedPlans['CREATOR']?.monthly;
  const creatorYearly = processedPlans['CREATOR']?.yearly;
  const proMonthly = processedPlans['PROFESSIONAL']?.monthly;
  const proYearly = processedPlans['PROFESSIONAL']?.yearly;

  const plansForClient = [
    {
      planName: t('pricingBasicPlan'),
      description: t('pricingBasicDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
      ],
      ctaText: t('getStarted'),
      planType: 'basic' as const,
      priceMonthly: getPrice(creatorMonthly).priceFormatted,
      priceYearly: getPrice(creatorYearly).priceFormatted,
      priceYearlyTotal: getPrice(creatorYearly).price,
    },
    {
      planName: t('pricingProPlan'),
      description: t('pricingProDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
        t('pricingFeature4'),
      ],
      ctaText: t('getStarted'),
      planType: 'pro' as const,
      isFeatured: true,
      priceMonthly: getPrice(proMonthly).priceFormatted,
      priceYearly: getPrice(proYearly).priceFormatted,
      priceYearlyTotal: getPrice(proYearly).price,
    },
    {
      planName: t('pricingEnterprisePlan'),
      priceMonthly: t('pricingContactUs'),
      priceYearly: t('pricingContactUs'),
      priceYearlyTotal: 0,
      description: t('pricingEnterpriseDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
        t('pricingFeature4'),
        t('pricingFeature5'),
      ],
      ctaText: t('contactSales'),
      planType: 'enterprise' as const,
    },
  ];

  return (
    <TranslationsProvider
      namespaces={['common']}
      locale={lang}
      resources={resources}
    >
      <PricingClient
        lang={lang}
        plans={plansForClient}
        translations={{
          monthly: t('monthly'),
          yearly: t('yearly'),
          save20: t('save20'),
          billedAs: t('billedAs'),
        }}
      />
    </TranslationsProvider>
  );
}