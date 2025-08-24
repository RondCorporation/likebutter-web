'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';

const PlanCard = ({
  planName,
  price,
  description,
  features,
  ctaText,
  ctaLink,
  isFeatured = false,
  onCtaClick,
}: {
  planName: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isFeatured?: boolean;
  onCtaClick: (link: string) => void;
}) => {
  const buttonClasses = isFeatured
    ? 'w-full rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-3 text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform will-change-transform duration-300 hover:-translate-y-1 hover:shadow-butter-yellow/40'
    : 'w-full rounded-full bg-white/30 px-8 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-white/40';

  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-8 ${
        isFeatured
          ? 'bg-slate-800/80 border-2 border-butter-yellow shadow-2xl shadow-butter-yellow/20'
          : 'bg-slate-800/50 border border-slate-700'
      } transition-transform duration-300 hover:scale-105`}
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white">{planName}</h3>
        <p className="mt-2 text-slate-300">{description}</p>
        <div className="mt-6">
          <span className="text-5xl font-extrabold text-white">{price}</span>
          {price.startsWith('$') && (
            <span className="text-lg font-medium text-slate-400">/mo</span>
          )}
        </div>
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-butter-yellow" />
              <span className="text-slate-200">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <button onClick={() => onCtaClick(ctaLink)} className={buttonClasses}>
          {ctaText}
        </button>
      </div>
    </div>
  );
};

export default function PricingClient({ lang }: { lang: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const handleCtaClick = (link: string) => {
    if (link.startsWith('mailto:')) {
      window.location.href = link;
      return;
    }

    if (isAuthenticated) {
      router.push(`/${lang}/studio/billing`);
    } else {
      router.push(link);
    }
  };

  const plans = [
    {
      planName: t('pricingBasicPlan'),
      price: '$10',
      description: t('pricingBasicDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
      ],
      ctaText: t('getStarted'),
      ctaLink: `/${lang}/login?returnTo=/${lang}/studio/billing`,
    },
    {
      planName: t('pricingProPlan'),
      price: '$25',
      description: t('pricingProDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
        t('pricingFeature4'),
      ],
      ctaText: t('getStarted'),
      ctaLink: `/${lang}/login?returnTo=/${lang}/studio/billing`,
      isFeatured: true,
    },
    {
      planName: t('pricingEnterprisePlan'),
      price: t('pricingContactUs'),
      description: t('pricingEnterpriseDesc'),
      features: [
        t('pricingFeature1'),
        t('pricingFeature2'),
        t('pricingFeature3'),
        t('pricingFeature4'),
        t('pricingFeature5'),
      ],
      ctaText: t('contactSales'),
      ctaLink: 'mailto:sales@likebutter.dev',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-32 text-white">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          {t('pricingTitle')}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300">
          {t('pricingSubtitle')}
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard key={index} {...plan} onCtaClick={handleCtaClick} />
        ))}
      </div>
    </div>
  );
}
