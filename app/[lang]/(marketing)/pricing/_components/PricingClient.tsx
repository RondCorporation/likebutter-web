'use client';

import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PortOne from '@portone/browser-sdk/v2';
import toast from 'react-hot-toast';
import {
  createSubscription,
  registerBillingKey,
  getSubscriptions,
} from '@/lib/apis/subscription.api';
import { useAuthStore } from '@/stores/authStore';
import { Plan as ApiPlan } from '@/app/_types/plan';
import { Subscription, PlanKey } from '@/app/_types/subscription';
import { useUIStore } from '@/app/_stores/uiStore';

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

const planRanks: Record<string, number> = {
  FREE: 0,
  CREATOR_MONTHLY: 1,
  CREATOR_YEARLY: 1,
  PROFESSIONAL_MONTHLY: 2,
  PROFESSIONAL_YEARLY: 2,
  ENTERPRISE: 3,
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
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { openSettings } = useUIStore();

  useEffect(() => {
    const fetchUserSubscription = async () => {
      if (isAuthenticated) {
        try {
          const { data: subscriptions } = await getSubscriptions();
          if (subscriptions) {
            const activeSub =
              subscriptions.find((sub) => sub.status === 'ACTIVE') || null;
            setActiveSubscription(activeSub);
          }
        } catch (error) {
          console.error('Failed to fetch user subscription:', error);
        }
      }
    };

    fetchUserSubscription();
  }, [isAuthenticated]);

  const activePlanKey = activeSubscription?.planKey ?? 'FREE';
  const activePlanRank = planRanks[activePlanKey] ?? 0;

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

      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: 'CARD',
      });

      if (!issueResponse || issueResponse.code) {
        throw new Error(
          `Billing key issuing failed: ${
            issueResponse?.message || 'User cancelled.'
          }`
        );
      }

      await registerBillingKey(issueResponse.billingKey);
      await createSubscription(planKey);
      router.push(`/${lang}/pricing/success`);
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
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
        <Check className="h-5 w-5 text-accent mx-auto" />
      ) : (
        <X className="h-5 w-5 text-slate-500 mx-auto" />
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

  const renderCtaButton = (plan: Plan) => {
    if (plan.key === 'Free') {
      return (
        <Link href={plan.href}>
          <button
            className={`w-full mt-4 rounded-md py-2.5 text-sm font-semibold transition bg-white/10 text-white hover:bg-white/20`}
          >
            {plan.cta}
          </button>
        </Link>
      );
    }

    const monthlyPlanRank = planRanks[plan.planKeyMonthly] ?? -1;
    const yearlyPlanRank = planRanks[plan.planKeyYearly] ?? -1;
    const currentPlanRank =
      billingCycle === 'monthly' ? monthlyPlanRank : yearlyPlanRank;

    if (activeSubscription) {
      if (
        (billingCycle === 'monthly' && activePlanKey === plan.planKeyMonthly) ||
        (billingCycle === 'yearly' && activePlanKey === plan.planKeyYearly)
      ) {
        return (
          <button
            disabled
            className="w-full mt-4 rounded-md py-2.5 text-sm font-semibold bg-accent/50 text-black cursor-default"
          >
            {translations.currentPlan}
          </button>
        );
      }

      if (currentPlanRank < activePlanRank) {
        return (
          <button
            disabled
            className="w-full mt-4 rounded-md py-2.5 text-sm font-semibold bg-slate-700 text-slate-400 cursor-not-allowed"
          >
            {translations.downgradeNotAvailable}
          </button>
        );
      }

      if (currentPlanRank > activePlanRank) {
        return (
          <button
            onClick={() => openSettings('subscription')}
            className={`w-full mt-4 rounded-md py-2.5 text-sm font-semibold transition bg-blue-500 text-white hover:bg-blue-400`}
          >
            {translations.upgradePlan}
          </button>
        );
      }
    }

    return (
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
        {isLoading ? translations.processing : plan.cta}
      </button>
    );
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
              <div className="grid grid-cols-5 gap-x-6 pt-4">
                <div className="col-span-1"></div>
                {plans.map((plan) => {
                  const isCurrentPlan =
                    isAuthenticated &&
                    activeSubscription &&
                    ((billingCycle === 'monthly' &&
                      activePlanKey === plan.planKeyMonthly) ||
                      (billingCycle === 'yearly' &&
                        activePlanKey === plan.planKeyYearly));

                  return (
                    <div
                      key={plan.name}
                      className={`relative col-span-1 p-4 rounded-t-lg ${
                        plan.isPopular ? 'bg-accent/10' : ''
                      } ${
                        isCurrentPlan
                          ? 'border-2 border-accent'
                          : 'border-2 border-transparent'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
                          {translations.currentPlan}
                        </div>
                      )}
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
                      {renderCtaButton(plan)}
                    </div>
                  );
                })}
              </div>
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
