'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started and exploring the platform.',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get Started Free',
    href: '/signup',
    isPopular: false,
    isCustom: false,
  },
  {
    name: 'Basic',
    description: 'For hobbyists who want to create more and faster.',
    priceMonthly: 10,
    priceYearly: 8,
    cta: 'Subscribe',
    href: '#',
    isPopular: false,
    isCustom: false,
  },
  {
    name: 'Creator',
    description: 'For creators building a consistent content pipeline.',
    priceMonthly: 30,
    priceYearly: 24,
    cta: 'Subscribe',
    href: '#',
    isPopular: true,
    isCustom: false,
  },
  {
    name: 'Professional',
    description: 'For professionals and teams with heavy usage needs.',
    priceMonthly: 75,
    priceYearly: 60,
    cta: 'Subscribe',
    href: '#',
    isPopular: false,
    isCustom: false,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for businesses and large teams.',
    priceMonthly: 'Custom',
    priceYearly: 'Custom',
    cta: 'Contact Sales',
    href: '/#contact',
    isPopular: false,
    isCustom: true,
  },
];

const FEATURES = [
  {
    category: 'Core Features',
    name: 'Monthly Credits',
    values: {
      Free: '300',
      Basic: '1,000',
      Creator: '4,000',
      Professional: '12,000',
      Enterprise: 'Custom',
    },
  },
  {
    category: 'Core Features',
    name: 'Generation Speed',
    values: {
      Free: 'Standard',
      Basic: 'Fast',
      Creator: 'Fast',
      Professional: 'Fast',
      Enterprise: 'Priority',
    },
  },
  {
    category: 'Core Features',
    name: 'Watermark on Exports',
    values: {
      Free: true,
      Basic: false,
      Creator: false,
      Professional: false,
      Enterprise: false,
    },
  },
  {
    category: 'Core Features',
    name: 'Credit Rollover',
    values: {
      Free: false,
      Basic: true,
      Creator: true,
      Professional: true,
      Enterprise: true,
    },
  },
  {
    category: 'Core Features',
    name: 'Purchase Extra Credits',
    values: {
      Free: false,
      Basic: true,
      Creator: true,
      Professional: true,
      Enterprise: true,
    },
  },
  {
    category: 'Usage per Credit',
    name: 'Chat (Tokens)',
    values: {
      Free: 'Up to 3,000',
      Basic: 'Up to 10,000',
      Creator: 'Up to 40,000',
      Professional: 'Up to 120,000',
      Enterprise: 'Custom',
    },
  },
  {
    category: 'Usage per Credit',
    name: 'Image (Generations)',
    values: {
      Free: 'Up to 30',
      Basic: 'Up to 100',
      Creator: 'Up to 400',
      Professional: 'Up to 1,200',
      Enterprise: 'Custom',
    },
  },
  {
    category: 'Usage per Credit',
    name: 'Video (Seconds)',
    values: {
      Free: 'Up to 7.5s',
      Basic: 'Up to 25s',
      Creator: 'Up to 100s',
      Professional: 'Up to 300s',
      Enterprise: 'Custom',
    },
  },
  {
    category: 'Usage per Credit',
    name: 'Cover (Generations)',
    values: {
      Free: 'Up to 6',
      Basic: 'Up to 20',
      Creator: 'Up to 80',
      Professional: 'Up to 240',
      Enterprise: 'Custom',
    },
  },
];

type PlanName = 'Free' | 'Basic' | 'Creator' | 'Professional' | 'Enterprise';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );

  const handleSubscribeClick = (planName: PlanName) => {
    if (planName !== 'Free' && planName !== 'Enterprise') {
      alert('결제 시스템 연동은 현재 준비 중입니다. 곧 다시 확인해주세요!');
    }
  };

  const groupedFeatures = FEATURES.reduce(
    (acc, feature) => {
      const { category = 'General' } = feature;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feature);
      return acc;
    },
    {} as Record<string, typeof FEATURES>
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

  return (
    <div className="min-h-screen bg-black px-4 pb-20 pt-28 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-accent md:text-5xl">
            Unlock Your Full Creative Potential
          </h1>
          <p className="mt-4 text-lg text-slate-300">
            Start for free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <span
            className={`font-medium transition ${billingCycle === 'monthly' ? 'text-accent' : 'text-slate-400'}`}
          >
            Monthly
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
            className={`font-medium transition ${billingCycle === 'yearly' ? 'text-accent' : 'text-slate-400'}`}
          >
            Yearly
            <span className="ml-2 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-300">
              Save 20%
            </span>
          </span>
        </div>

        <div className="mt-12 overflow-x-auto pb-4">
          <div className="min-w-[1200px] w-full">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-x-6">
              <div className="col-span-1"></div> {/* Empty top-left corner */}
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`col-span-1 p-4 rounded-t-lg ${plan.isPopular ? 'bg-accent/10' : ''}`}
                >
                  <h2
                    className={`text-xl font-bold ${plan.isPopular ? 'text-accent' : 'text-white'}`}
                  >
                    {plan.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 h-10">
                    {plan.description}
                  </p>
                  <div className="mt-4 h-20">
                    {plan.isCustom ? (
                      <span className="text-4xl font-bold">Custom</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">
                          $
                          {billingCycle === 'monthly'
                            ? plan.priceMonthly
                            : plan.priceYearly}
                        </span>
                        <span className="text-lg text-slate-400">/mo</span>
                        {billingCycle === 'yearly' &&
                          plan.priceMonthly !== 0 && (
                            <p className="text-xs text-slate-500">
                              Billed as ${(plan.priceYearly as number) * 12}
                              /year
                            </p>
                          )}
                      </>
                    )}
                  </div>
                  <Link href={plan.href}>
                    <button
                      onClick={() =>
                        handleSubscribeClick(plan.name as PlanName)
                      }
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
                  <div className="grid grid-cols-6 gap-x-6 items-center bg-black">
                    <h3 className="text-base font-semibold text-slate-300 py-4 col-span-6 px-4">
                      {category}
                    </h3>
                  </div>
                  {featuresInSection.map((feature, featureIdx) => (
                    <div
                      key={feature.name}
                      className={`grid grid-cols-6 gap-x-6 items-center text-center ${featureIdx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-black'}`}
                    >
                      <div className="col-span-1 text-left text-sm text-slate-300 p-4">
                        {feature.name}
                      </div>
                      {PLANS.map((plan) => {
                        const value = feature.values[plan.name as PlanName];
                        return (
                          <div
                            key={`${plan.name}-${feature.name}`}
                            className={`col-span-1 p-4 text-white ${plan.isPopular ? 'bg-accent/5' : ''}`}
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
          <Link href="/studio" className="text-accent hover:underline">
            Go to the Studio →
          </Link>
        </div>
      </div>
    </div>
  );
}
