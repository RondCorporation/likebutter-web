import initTranslations from '@/lib/i18n-server';
import PricingClient from './pricing-client';
import nextI18NextConfig from '../../../next-i18next.config.mjs';

type Props = {
  params: { lang: string };
};

export function generateStaticParams() {
  return nextI18NextConfig.i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function PricingPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

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
    },
    {
      key: 'Creator',
      name: t('planCreatorName'),
      description: t('planCreatorDesc'),
      priceMonthly: 25,
      priceYearly: 20,
      cta: t('planCreatorCta'),
      href: '#',
      isPopular: true,
      isCustom: false,
    },
    {
      key: 'Professional',
      name: t('planProfessionalName'),
      description: t('planProfessionalDesc'),
      priceMonthly: 75,
      priceYearly: 60,
      cta: t('planProfessionalCta'),
      href: '#',
      isPopular: false,
      isCustom: false,
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
  };

  return (
    <PricingClient
      lang={lang}
      plans={plans}
      features={features}
      translations={translations}
    />
  );
}
