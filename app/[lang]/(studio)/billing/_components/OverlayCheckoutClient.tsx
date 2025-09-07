'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loadPortone } from '@/lib/portone';
import {
  createSubscription,
  registerBillingKey,
  getSubscriptionDetails,
} from '@/app/_lib/apis/subscription.api.client';
import { useAuthStore } from '@/stores/authStore';
import { CheckCircle2, Shield, CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PlanForCheckout = {
  name: string;
  priceFormatted: string;
  features: string[];
  planKey: string;
};

type OverlayCheckoutClientProps = {
  lang: string;
  plan: PlanForCheckout;
};

export default function OverlayCheckoutClient({
  lang,
  plan,
}: OverlayCheckoutClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      toast.error(t('loginRequiredForPayment'));
      router.push(
        `/${lang}/login?returnTo=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
      return;
    }

    setIsLoading(true);
    const loadingToastId = toast.loading(
      t('paymentPreparing') || '결제 준비 중...'
    );

    try {
      const PortOne = await loadPortone();
      toast.dismiss(loadingToastId);

      const { planKey } = plan;
      if (!planKey) {
        throw new Error(t('planNotAvailableError'));
      }

      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) {
        throw new Error(t('paymentEnvError'));
      }

      const issueResponse = await PortOne.requestIssueBillingKey({
        storeId,
        channelKey,
        billingKeyMethod: 'CARD',
      });

      if (!issueResponse || issueResponse.code) {
        throw new Error(
          `${t('billingKeyError')}: ${
            issueResponse?.message || t('userCancelled')
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
        throw new Error(t('subscriptionIdError'));
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      toast.error(`${t('genericError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          {t('checkoutTitle')}
        </h1>
        <p className="text-lg text-slate-300">{t('checkoutSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Plan Summary */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <h2 className="text-xl font-bold text-butter-yellow mb-6">
            {t('orderSummary')}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">{t('plan')}:</span>
              <span className="text-lg font-semibold text-white">
                {plan.name}
              </span>
            </div>

            <div className="border-t border-slate-700"></div>

            <ul className="space-y-3 pt-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-700"></div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-lg text-slate-300">{t('total')}:</span>
              <span className="text-2xl font-bold text-butter-yellow">
                {plan.priceFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Payment */}
        <div className="rounded-xl border-2 border-butter-yellow/20 bg-slate-800/80 p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {t('paymentDetails')}
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 p-3">
              <CreditCard className="h-5 w-5 text-butter-yellow" />
              <span className="font-medium text-slate-200">
                {t('creditCard')}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Shield className="h-4 w-4 text-green-400" />
              <span>{t('securePayment')}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-butter-yellow to-butter-orange px-6 py-4 text-lg font-semibold text-black shadow-lg transition-all duration-200 hover:shadow-butter-yellow/20 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? t('processing') : `${t('pay')} ${plan.priceFormatted}`}
          </button>
        </div>
      </div>
    </div>
  );
}
