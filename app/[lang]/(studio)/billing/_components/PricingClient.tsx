'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { CheckCircle2, Shield, CreditCard, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
            <>
              <span className="text-lg font-medium text-slate-400">/mo</span>
              <div className="mt-2 text-sm text-slate-400">
                {billingCycle === 'monthly' 
                  ? translations.servicePeriodMonthly 
                  : translations.servicePeriodYearly
                }
              </div>
            </>
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
        {getButton()}
        {!plan.isCustom && !isCurrent && !isDowngrade && (
          <div className="mt-3 text-center text-xs text-slate-400">
            <div>{billingCycle === 'monthly' ? translations.monthlyBilling : translations.yearlyBilling}</div>
            <div className="mt-1">{translations.autoRenewing}</div>
          </div>
        )}
      </div>
    </div>
  );
};

function PricingClientContent({
  lang,
  plans,
  features,
  translations,
  currency,
}: Props) {
  const searchParams = useSearchParams();
  const selectedPlanParam = searchParams.get('plan'); // basic, pro, enterprise
  const billingParam = searchParams.get('billing'); // monthly, yearly
  
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    (billingParam as 'monthly' | 'yearly') || 'yearly'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubscription, setActiveSubscription] =
    useState<Subscription | null>(null);
  const [currentStep, setCurrentStep] = useState<'selection' | 'checkout' | 'confirmation'>(
    selectedPlanParam ? 'checkout' : 'selection'
  );
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

  // 현재 구독에 따른 플랜 필터링 및 추천 로직
  const getPersonalizedPlans = () => {
    if (!activeSubscription || activePlanKey === 'FREE') {
      // 무료 사용자: 모든 유료 플랜 표시
      return plans.filter(p => p.key !== 'Free' && (p.isCustom || p.planKeyMonthly || p.planKeyYearly));
    }

    // 현재 구독이 있는 사용자: 현재 플랜 + 업그레이드 가능한 플랜만 표시
    return plans.filter(p => {
      if (p.key === 'Free') return false;
      if (!p.isCustom && !p.planKeyMonthly && !p.planKeyYearly) return false;

      const monthlyPlanRank = planRanks[p.planKeyMonthly] ?? -1;
      const yearlyPlanRank = planRanks[p.planKeyYearly] ?? -1;
      const maxPlanRank = Math.max(monthlyPlanRank, yearlyPlanRank);

      // 현재 플랜이거나 업그레이드 가능한 플랜만 표시
      return maxPlanRank >= activePlanRank;
    });
  };

  const personalizedPlans = getPersonalizedPlans();

  const handlePayment = async (plan: Plan) => {
    if (!isAuthenticated || !user) {
      // searchParams를 사용하여 현재 쿼리 파라미터를 포함한 returnTo 생성
      const queryString = searchParams.toString();
      const currentUrl = `/${lang}/billing${queryString ? `?${queryString}` : ''}`;
      const returnToParam = encodeURIComponent(currentUrl);
      router.push(`/${lang}/login?returnTo=${returnToParam}`);
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

  // 현재 플랜 정보 표시용 함수
  const getCurrentPlanInfo = () => {
    if (!activeSubscription) return null;
    
    const currentPlan = plans.find(p => 
      p.planKeyMonthly === activePlanKey || p.planKeyYearly === activePlanKey
    );
    
    return currentPlan;
  };

  const currentPlan = getCurrentPlanInfo();
  const isYearlySubscription = activePlanKey.includes('YEARLY');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 text-white">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">
          {activeSubscription ? translations.managePlan : translations.title}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300">
          {activeSubscription 
            ? `현재 ${currentPlan?.name || activePlanKey} 플랜을 이용 중입니다` 
            : translations.subtitle}
        </p>
      </div>

      {/* 현재 구독 상태 표시 */}
      {activeSubscription && currentPlan && (
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-slate-800/60 border border-butter-yellow/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-butter-yellow">
                  현재 플랜: {currentPlan.name}
                </h3>
                <p className="text-slate-300 mt-1">
                  {isYearlySubscription ? translations.yearlyBilling : translations.monthlyBilling}<br/>
                  만료일: {new Date(activeSubscription.endDate).toLocaleDateString('ko-KR')} | {translations.autoRenewing}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {isYearlySubscription 
                    ? (typeof currentPlan.priceYearly === 'number' ? `₩${currentPlan.priceYearly.toLocaleString()}/년` : currentPlan.priceYearly)
                    : (typeof currentPlan.priceMonthly === 'number' ? `₩${currentPlan.priceMonthly.toLocaleString()}/월` : currentPlan.priceMonthly)
                  }
                </div>
                <div className="text-sm text-slate-400">
                  상태: {activeSubscription.status === 'ACTIVE' ? '활성' : activeSubscription.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 추천 플랜 섹션 */}
      {activeSubscription && personalizedPlans.length > 1 && (
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            더 나은 플랜으로 업그레이드하세요
          </h2>
          <p className="text-slate-300">
            현재 플랜보다 더 많은 기능을 이용할 수 있는 플랜을 확인해보세요
          </p>
        </div>
      )}

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

      <div className={`mt-16 grid gap-8 ${personalizedPlans.length === 1 ? 'justify-center max-w-md mx-auto' : personalizedPlans.length === 2 ? 'sm:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto' : 'sm:grid-cols-1 lg:grid-cols-3'}`}>
        {personalizedPlans.map((plan) => {
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
              activeSubscription && currentPlanRank > activePlanRank && !isCurrent;

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

      {/* 무료 사용자에게 프리미엄 기능 안내 */}
      {!activeSubscription && (
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-butter-yellow/10 to-butter-orange/10 border border-butter-yellow/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-butter-yellow mb-4">
              🎯 프리미엄 기능을 경험해보세요
            </h3>
            <p className="text-slate-300 text-lg mb-6">
              더 빠른 AI 처리, 무제한 생성, 고품질 결과물과 함께<br />
              Like-Butter의 모든 기능을 마음껏 활용하세요
            </p>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-butter-yellow font-semibold mb-2">⚡ 빠른 처리속도</div>
                <div className="text-slate-300">우선순위 처리로 더 빠른 결과</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-butter-yellow font-semibold mb-2">🎨 고품질 결과물</div>
                <div className="text-slate-300">프리미엄 AI 모델 액세스</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <div className="text-butter-yellow font-semibold mb-2">📈 무제한 사용</div>
                <div className="text-slate-300">일일 한도 없이 자유롭게</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PricingClient(props: Props) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 sm:px-6 py-16 text-white flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-butter-yellow"></div>
      </div>
    }>
      <PricingClientContent {...props} />
    </Suspense>
  );
}
