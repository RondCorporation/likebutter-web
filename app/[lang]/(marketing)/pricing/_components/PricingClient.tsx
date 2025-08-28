'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { getMe } from '@/app/_lib/apis/user.api';
import { CheckCircle2 } from 'lucide-react';

type Plan = {
  planName: string;
  description: string;
  features: string[];
  ctaText: string;
  planType: 'basic' | 'pro' | 'enterprise';
  isFeatured?: boolean;
  priceMonthly: string;
  priceYearly: string;
  priceYearlyTotal: number;
};

type Translations = {
  monthly: string;
  yearly: string;
  save20: string;
  billedAs: string;
};

const PlanCard = ({
  plan,
  billingCycle,
  onCtaClick,
}: {
  plan: Plan;
  billingCycle: 'monthly' | 'yearly';
  onCtaClick: (planType: 'basic' | 'pro' | 'enterprise') => void;
}) => {
  const buttonClasses = plan.isFeatured
    ? 'w-full rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-3 text-lg font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform will-change-transform duration-300 hover:-translate-y-1 hover:shadow-butter-yellow/40'
    : 'w-full rounded-full bg-white/30 px-8 py-3 text-lg font-semibold text-white transition-colors duration-300 hover:bg-white/40';

  const price =
    billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-8 ${
        plan.isFeatured
          ? 'border-2 border-butter-yellow bg-slate-800/80 shadow-2xl shadow-butter-yellow/20'
          : 'border border-slate-700 bg-slate-800/50'
      } transition-transform duration-300 hover:scale-105`}
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white">{plan.planName}</h3>
        <p className="mt-2 text-slate-300">{plan.description}</p>
        <div className="mt-6">
          <span className="text-5xl font-extrabold text-white">{price}</span>
          {plan.planType !== 'enterprise' && (
            <span className="text-lg font-medium text-slate-400">/mo</span>
          )}
        </div>
        <ul className="mt-8 space-y-4">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-butter-yellow" />
              <span className="text-slate-200">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10">
        <button
          onClick={() => onCtaClick(plan.planType)}
          className={buttonClasses}
        >
          {plan.ctaText}
        </button>
      </div>
    </div>
  );
};

export default function PricingClient({
  lang,
  plans,
  translations,
}: {
  lang: string;
  plans: Plan[];
  translations: Translations;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly',
  );

  const handleCtaClick = async (planType: 'basic' | 'pro' | 'enterprise') => {
    if (planType === 'enterprise') {
      window.location.href = 'mailto:sales@likebutter.dev';
      return;
    }

    const url = `/${lang}/billing?plan=${planType}&billing=${billingCycle}`;

    try {
      const response = await getMe();
      if (response.data && response.data.accountId) {
        router.push(url);
      } else {
        window.location.href = `/${lang}/login?returnTo=${encodeURIComponent(
          url,
        )}`;
      }
    } catch (error) {
      window.location.href = `/${lang}/login?returnTo=${encodeURIComponent(
        url,
      )}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-32 text-white sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-extrabold text-white md:text-5xl">
          {t('pricingTitle')}
        </h1>
        <p className="mt-4 text-lg text-slate-300 md:text-xl">
          {t('pricingSubtitle')}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <span
          className={`font-medium transition ${
            billingCycle === 'monthly'
              ? 'text-butter-yellow'
              : 'text-slate-400'
          }`}
        >
          {translations.monthly}
        </span>
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={billingCycle === 'yearly'}
            onChange={() =>
              setBillingCycle(
                billingCycle === 'monthly' ? 'yearly' : 'monthly',
              )
            }
          />
          <div className="peer h-7 w-14 rounded-full bg-slate-700 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all peer-checked:bg-butter-yellow peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
        <span
          className={`font-medium transition ${
            billingCycle === 'yearly' ? 'text-butter-yellow' : 'text-slate-400'
          }`}
        >
          {translations.yearly}
          <span className="ml-2 rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-300">
            {translations.save20}
          </span>
        </span>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.planType}
            plan={plan}
            billingCycle={billingCycle}
            onCtaClick={handleCtaClick}
          />
        ))}
      </div>
    </div>
  );
}
