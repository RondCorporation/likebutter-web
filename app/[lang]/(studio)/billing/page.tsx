import { redirect } from 'next/navigation';
import initTranslations from '@/app/_lib/i18n-server';
import SimpleBillingClient from './_components/SimpleBillingClient';
import CheckoutOverlay from './_components/CheckoutOverlay';
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

    return <CheckoutOverlay lang={lang} plan={planForCheckout} />;
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

  // Show simple pricing overlay
  return (
    <SimpleBillingClient
      lang={lang}
      plans={apiPlans || []}
      currency={currency}
    />
  );
}
