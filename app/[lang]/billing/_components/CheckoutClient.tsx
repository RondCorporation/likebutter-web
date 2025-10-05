'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loadPortone } from '@/lib/portone';
import { usePortonePreload } from '@/components/portone/PreloadPortoneProvider';
import {
  createSubscription,
  registerBillingKey,
} from '@/lib/apis/subscription.api';
import { useAuthStore } from '@/stores/authStore';
import {
  CheckCircle2,
  Shield,
  CreditCard,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

type PlanForCheckout = {
  name: string;
  priceFormatted: string;
  features: string[];
  planKey: string;
  billingCycle: string;
};

type CheckoutClientProps = {
  lang: string;
  plan: PlanForCheckout;
};

export default function CheckoutClient({ lang, plan }: CheckoutClientProps) {
  const { t } = useTranslation(['billing', 'common']);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );

  const {
    preloadPortone,
    getPortone,
    isLoaded,
    isLoading: sdkIsLoading,
    error: sdkError,
  } = usePortonePreload();

  useEffect(() => {
    if (!isLoaded && !sdkIsLoading) {
      preloadPortone()
        .then(() => setSdkStatus('ready'))
        .catch(() => setSdkStatus('error'));
    } else if (isLoaded) {
      setSdkStatus('ready');
    }
  }, [preloadPortone, isLoaded, sdkIsLoading]);

  useEffect(() => {
    if (sdkError) {
      setSdkStatus('error');
    } else if (isLoaded) {
      setSdkStatus('ready');
    } else if (sdkIsLoading) {
      setSdkStatus('loading');
    }
  }, [isLoaded, sdkIsLoading, sdkError]);

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      toast.error(t('billing:payment.errors.loginRequired'));
      router.push(
        `/${lang}/login?returnTo=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
      return;
    }

    if (sdkStatus === 'error') {
      toast.error(t('billing:payment.errors.sdkLoad'));
      return;
    }

    setIsLoading(true);

    const loadingToastId = toast.loading(
      t('billing:checkout.openingPaymentWindow')
    );

    try {
      let PortOne = getPortone();

      if (!PortOne) {
        console.debug('Falling back to dynamic SDK loading');
        PortOne = await loadPortone();
      }

      const { planKey } = plan;
      if (!planKey) {
        throw new Error(t('billing:payment.errors.planNotAvailable'));
      }

      localStorage.setItem('selectedPlanKey', planKey);

      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) {
        throw new Error(t('billing:payment.errors.paymentEnv'));
      }

      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: 'CARD',
        redirectUrl: `${window.location.origin}/${lang}/billing/callback`,
      });

      toast.dismiss(loadingToastId);

      if (!issueResponse || issueResponse.code) {
        throw new Error(
          `${t('billing:payment.errors.billingKey')}: ${
            issueResponse?.message || t('billing:payment.errors.userCancelled')
          }`
        );
      }

      await registerBillingKey(issueResponse.billingKey);

      const createSubResponse = await createSubscription(planKey);

      if (createSubResponse.data?.paymentId) {
        router.push(
          `/${lang}/billing/receipt/${createSubResponse.data.paymentId}`
        );
      } else {
        throw new Error(t('billing:payment.errors.subscriptionId'));
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(`${t('billing:payment.errors.generic')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header Navigation */}
      <div className="bg-slate-900/50 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/studio`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('billing:plans.backToStudio')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-center bg-slate-900 p-4 text-white"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              {t('billing:checkout.title')}
            </h1>
            <p className="mt-4 text-lg text-slate-300 md:text-xl">
              {t('billing:checkout.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Left Side: Plan Summary */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-8">
              <h2 className="mb-6 text-2xl font-bold text-butter-yellow">
                {t('billing:checkout.orderSummary')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">
                    {t('billing:checkout.plan')}:
                  </span>
                  <span className="text-lg font-semibold">{plan.name}</span>
                </div>
                <div className="border-t border-slate-700"></div>
                <ul className="space-y-3 pt-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-700"></div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-lg text-slate-300">
                    {t('billing:checkout.total')}:
                  </span>
                  <span className="text-3xl font-extrabold text-butter-yellow">
                    {plan.priceFormatted}
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href={`/${lang}/billing`}
                  className="flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-butter-yellow"
                >
                  <ArrowLeft size={16} />
                  {t('billing:checkout.changePlan')}
                </Link>
              </div>
            </div>

            {/* Right Side: Payment */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-butter-yellow bg-slate-800/80 p-8 shadow-2xl shadow-butter-yellow/20">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-white">
                  {t('billing:checkout.paymentDetails')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 p-3">
                    <CreditCard className="h-6 w-6 text-butter-yellow" />
                    <span className="font-semibold text-slate-200">
                      {t('billing:checkout.creditCard')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>{t('billing:checkout.securePayment')}</span>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button
                  onClick={handlePayment}
                  disabled={isLoading || sdkStatus === 'loading'}
                  className="w-full rounded-full bg-gradient-to-r from-butter-yellow to-butter-orange px-8 py-4 text-xl font-semibold text-black shadow-lg shadow-butter-yellow/20 transition-transform duration-300 will-change-transform hover:-translate-y-1 hover:shadow-butter-yellow/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('billing:plans.processing')}
                    </div>
                  ) : sdkStatus === 'loading' ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {t('billing:plans.sdkPreparing')}
                    </div>
                  ) : sdkStatus === 'error' ? (
                    t('billing:plans.sdkError')
                  ) : (
                    `${t('billing:checkout.pay')} ${plan.priceFormatted}`
                  )}
                </button>

                {/* SDK Status Indicator */}
                {sdkStatus === 'loading' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('billing:checkout.preparingPayment')}
                  </div>
                )}

                {sdkStatus === 'ready' && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    {t('billing:checkout.paymentReady')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
