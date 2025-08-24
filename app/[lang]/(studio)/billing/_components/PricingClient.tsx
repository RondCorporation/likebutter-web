'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PortOne from '@portone/browser-sdk/v2';
import toast from 'react-hot-toast';
import {
  createSubscription,
  registerBillingKey,
  getSubscriptions,
  getSubscriptionDetails,
} from '@/app/_lib/apis/subscription.api.client';
import { useAuthStore } from '@/stores/authStore';
import { Plan as ApiPlan } from '@/app/_types/plan';
import { Subscription } from '@/app/_types/subscription';
import { useUIStore } from '@/app/_stores/uiStore';
import { CheckCircle2 } from 'lucide-react';

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

const PlanCard = ({
  plan,
  billingCycle,
  currency,
  translations,
  isLoading,
  isCurrent,
  isDowngrade,
  isUpgrade,
  onCtaClick,
  onUpgradeClick,
  features,
}: {
  plan: Plan;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  translations: Translations;
  isLoading: boolean;
  isCurrent: boolean;
  isDowngrade: boolean;
  isUpgrade: boolean;
  onCtaClick: (plan: Plan) => void;
  onUpgradeClick: () => void;
  features: string[];
}) => {
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

  const price =
    billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

  const getButton = () => {
    if (isCurrent) {
      return (
        <button
          disabled
          className="w-full rounded-full bg-butter-yellow/50 px-8 py-3 text-lg font-semibold text-black cursor-default"
        >
          {translations.currentPlan}
        </button>
      );
    }
    if (isDowngrade) {
      return (
        <button
          disabled
          className="w-full rounded-full bg-slate-700 px-8 py-3 text-lg font-semibold text-slate-400 cursor-not-allowed"
        >
          {translations.downgradeNotAvailable}
        </button>
      );
    }
    if (isUpgrade) {
      return (
        <button
          onClick={onUpgradeClick}
          className="w-full rounded-full bg-blue-500 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-400"
        >
          {translations.upgradePlan}
        </button>
      );
    }
    return (
      <button
        onClick={() => onCtaClick(plan)}
        disabled={isLoading}
        className={`w-full rounded-full px-8 py-3 text-lg font-semibold text-black transition-transform will-change-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70 ${
          plan.isPopular
            ? 'bg-gradient-to-r from-butter-yellow to-butter-orange shadow-lg shadow-butter-yellow/20 hover:shadow-butter-yellow/40'
            : 'bg-white/30 text-white hover:bg-white/40'
        }`}
      >
        {isLoading ? translations.processing : plan.cta}
      </button>
    );
  };

  return (
    <div
      className={`flex h-full flex-col rounded-2xl p-8 ${
        plan.isPopular
          ? 'bg-slate-800/80 border-2 border-butter-yellow shadow-2xl shadow-butter-yellow/20'
          : 'bg-slate-800/50 border border-slate-700'
      } ${isCurrent ? 'ring-2 ring-butter-yellow ring-offset-4 ring-offset-black' : ''}`}
    >
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
        <p className="mt-2 text-slate-300 h-12">{plan.description}</p>
        <div className="mt-6">
          <span className="text-5xl font-extrabold text-white">
            {formatPrice(price)}
          </span>
          {!plan.isCustom && (
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
      <div className="mt-10">{getButton()}</div>
    </div>
  );
};

export default function PricingClient({
  lang,
  plans,
  features,
  translations,
  currency,
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
      const createSubResponse = await createSubscription(planKey);

      if (createSubResponse.data?.subscriptionId) {
        const detailsResponse = await getSubscriptionDetails(
          createSubResponse.data.subscriptionId
        );
        const latestPayment = detailsResponse.data?.paymentHistory?.[0];

        if (latestPayment) {
          router.push(`/${lang}/payments/${latestPayment.paymentId}`);
        } else {
          router.push(`/${lang}/billing/success`);
        }
      } else {
        throw new Error(
          'Subscription creation failed to return a subscription ID.'
        );
      }
    } catch (error: any) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 text-white">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          {translations.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300">
          {translations.subtitle}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <span
          className={`font-medium transition ${
            billingCycle === 'monthly' ? 'text-butter-yellow' : 'text-slate-400'
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
              setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
            }
          />
          <div className="peer h-7 w-14 rounded-full bg-slate-700 after:absolute after:left-[4px] after:top-[4px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:content[''] after:transition-all peer-checked:bg-butter-yellow peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
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
        {plans
          .filter(
            (p) =>
              p.key !== 'Free' &&
              (p.isCustom || p.planKeyMonthly || p.planKeyYearly)
          )
          .map((plan) => {
            const monthlyPlanRank = planRanks[plan.planKeyMonthly] ?? -1;
            const yearlyPlanRank = planRanks[plan.planKeyYearly] ?? -1;
            const currentPlanRank =
              billingCycle === 'monthly' ? monthlyPlanRank : yearlyPlanRank;

            const isCurrent =
              activeSubscription &&
              ((billingCycle === 'monthly' &&
                activePlanKey === plan.planKeyMonthly) ||
                (billingCycle === 'yearly' &&
                  activePlanKey === plan.planKeyYearly));

            const isDowngrade =
              activeSubscription && currentPlanRank < activePlanRank;
            const isUpgrade =
              activeSubscription && currentPlanRank > activePlanRank;

            const planFeatures = features
              .filter((f) => f.category === translations.featureCategoryCore)
              .slice(0, 3)
              .map((feature) => {
                const value = feature.values[plan.name];
                if (typeof value === 'boolean') {
                  return `${feature.name}: ${value ? 'Yes' : 'No'}`;
                }
                return `${feature.name}: ${value}`;
              });

            return (
              <PlanCard
                key={plan.key}
                plan={plan}
                billingCycle={billingCycle}
                currency={currency}
                translations={translations}
                isLoading={isLoading}
                isCurrent={!!isCurrent}
                isDowngrade={!!isDowngrade}
                isUpgrade={!!isUpgrade}
                onCtaClick={handlePayment}
                onUpgradeClick={() => openSettings('subscription')}
                features={planFeatures}
              />
            );
          })}
      </div>
    </div>
  );
}
