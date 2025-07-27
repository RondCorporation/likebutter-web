'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PortOne from '@portone/browser-sdk/v2';
import { createSubscription, registerBillingKey } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Plan as ApiPlan } from '@/app/_types/plan';

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
  planKeyMonthly: string;
  planKeyYearly: string;
  priceYearlyTotal: number;
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
  currency: string;
  apiPlans: ApiPlan[];
};

export default function PricingClient({
  lang,
  plans,
  features,
  translations,
  currency,
  apiPlans,
}: Props) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const handlePayment = async (plan: Plan) => {
    if (!isAuthenticated || !user) {
      router.push(`/${lang}/login`);
      return;
    }

    if (plan.isCustom) {
      window.location.href = plan.href;
      return;
    }

    setIsLoading(true);

    try {
      const planKey =
        billingCycle === 'monthly' ? plan.planKeyMonthly : plan.planKeyYearly;
      if (!planKey) {
        throw new Error('Selected plan is not available for purchase.');
      }

      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) {
        throw new Error('Payment environment variables are not set.');
      }

      // 1. 빌링키 발급 요청
      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: 'CARD',
      });

      if (!issueResponse || issueResponse.code) {
        throw new Error(
          `Billing key issuing failed: ${issueResponse?.message || 'User cancelled.'}`
        );
      }

      // 2. 발급된 빌링키를 백엔드에 등록
      await registerBillingKey(issueResponse.billingKey);

      // 3. 등록된 빌링키로 구독 생성 및 결제
      await createSubscription(planKey);

      // 4. 성공 페이지로 이동
      router.push(`/${lang}/pricing/success`);
    } catch (error: any) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
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
    const formattedPrice =
      currency === '₩'
        ? price.toLocaleString('ko-KR')
        : price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
    return `${currency}${formattedPrice}`;
  };

  return (
    <>
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
                                {translations.billedAs}
                                {formatPrice(plan.priceYearlyTotal)} /year
                              </p>
                            )}
                        </>
                      )}
                    </div>
                    {plan.key === 'Free' ? (
                      <Link href={plan.href}>
                        <button
                          className={`w-full mt-4 rounded-md py-2.5 text-sm font-semibold transition bg-white/10 text-white hover:bg-white/20`}
                        >
                          {plan.cta}
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handlePayment(plan)}
                        disabled={isLoading}
                        className={`w-full mt-4 rounded-md py-2.5 text-sm font-semibold transition ${
                          plan.isPopular
                            ? 'bg-accent text-black hover:brightness-90'
                            : plan.isCustom
                              ? 'bg-slate-600 text-white hover:bg-slate-500'
                              : 'bg-white/10 text-white hover:bg-white/20'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? 'Processing...' : plan.cta}
                      </button>
                    )}
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
                          featureIdx % 2 === 0 ? 'bg-white/[0.02]' : 'bg-black'
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
    </>
  );
}
