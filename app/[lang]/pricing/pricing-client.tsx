'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

type Plan = {
  key: string;
  name: string;
  description: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  cta: string;
  href: string;
  isPopular: boolean;
  isCustom: boolean;
};

type Feature = {
  category: string;
  name: string;
  values: {
    [key: string]: string | boolean;
  };
};

type Translations = {
  [key: string]: string;
};

type Props = {
  lang: string;
  plans: Plan[];
  features: Feature[];
  translations: Translations;
};

export default function PricingClient({
  lang,
  plans,
  features,
  translations,
}: Props) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );

  const handleSubscribeClick = (planName: string) => {
    const plan = plans.find((p) => p.name === planName);
    if (plan && plan.key !== 'Free' && plan.key !== 'Enterprise') {
      alert(translations.paymentAlert);
    }
  };

  const groupedFeatures = features.reduce(
    (acc, feature) => {
      const { category = 'General' } = feature;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feature);
      return acc;
    },
    {} as Record<string, typeof features>
  );

  const getFeatureValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <X className="h-5 w-5 text-slate-500 mx-auto" />
      ) : (
        <Check className="h-5 w-5 text-accent mx-auto" />
      );
    }
    return <span className="text-sm">{value}</span>;
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return lang === 'ko'
      ? `₩${price.toLocaleString('ko-KR')}`
      : `${price.toLocaleString('en-US')}`;
  };

  return (
    <div className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-accent md:text-5xl">
            {translations.title}
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            {translations.subtitle}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={`font-medium transition ${
              billingCycle === 'monthly' ? 'text-accent' : 'text-slate-400'
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
                  billingCycle === 'monthly' ? 'yearly' : 'monthly'
                )
              }
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:content-[''] after:transition-all peer-checked:bg-accent peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
          <span
            className={`font-medium transition ${
              billingCycle === 'yearly' ? 'text-accent' : 'text-slate-400'
            }`}
          >
            {translations.yearly}
            <span className="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-300">
              {translations.save20}
            </span>
          </span>
        </div>

        <div className="mt-12 overflow-x-auto pb-4">
          <div className="min-w-[1200px] w-full">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-x-6">
              <div className="col-span-1"></div>
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`col-span-1 p-4 rounded-t-lg ${
                    plan.isPopular ? 'bg-accent/10' : ''
                  }`}
                >
                  <h2
                    className={`text-xl font-bold ${
                      plan.isPopular ? 'text-accent' : 'text-white'
                    }`}
                  >
                    {plan.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 h-10">
                    {plan.description}
                  </p>
                  <div className="mt-4 h-20">
                    {plan.isCustom ? (
                      <span className="text-4xl font-bold">
                        {plan.priceMonthly}
                      </span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          {formatPrice(
                            billingCycle === 'monthly'
                              ? plan.priceMonthly
                              : plan.priceYearly
                          )}
                        </span>
                        <span className="text-lg text-slate-400">/mo</span>
                        {billingCycle === 'yearly' &&
                          plan.priceMonthly !== 0 && (
                            <p className="text-xs text-slate-500">
                              {translations.billedAs}{' '}
                              {formatPrice((plan.priceYearly as number) * 12)}
                              /year
                            </p>
                          )}
                      </>
                    )}
                  </div>
                  <Link href={plan.href}>
                    <button
                      onClick={() => handleSubscribeClick(plan.name)}
                      className={`w-full mt-4 rounded-md py-2.5 text-sm font-semibold transition ${
                        plan.isPopular
                          ? 'bg-accent text-black hover:brightness-90'
                          : plan.isCustom
                          ? 'bg-slate-600 text-white hover:bg-slate-500'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </Link>
                </div>
              ))}
            </div>

            {/* Table Body */}
            {Object.entries(groupedFeatures).map(
              ([category, featuresInSection]) => (
                <Fragment key={category}>
                  <div className="grid grid-cols-5 gap-x-6 items-center bg-black">
                    <h3 className="text-base font-semibold text-slate-300 py-4 col-span-5 px-4">
                      {category}
                    </h3>
                  </div>
                  {featuresInSection.map((feature, featureIdx) => (
                    <div
                      key={feature.name}
                      className={`grid grid-cols-5 gap-x-6 items-center text-center ${
                        featureIdx % 2 === 0
                          ? 'bg-white/[0.02]'
                          : 'bg-black'
                      }`}
                    >
                      <div className="col-span-1 text-left text-sm text-slate-300 p-4">
                        {feature.name}
                      </div>
                      {plans.map((plan) => {
                        const value = feature.values[plan.name];
                        return (
                          <div
                            key={`${plan.name}-${feature.name}`}
                            className={`col-span-1 p-4 text-white ${
                              plan.isPopular ? 'bg-accent/5' : ''
                            }`}
                          >
                            {getFeatureValue(value)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </Fragment>
              )
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href={`/${lang}/studio`}
            className="text-accent hover:underline"
          >
            {translations.goToStudio} →
          </Link>
        </div>
      </div>
    </div>
  );
}
