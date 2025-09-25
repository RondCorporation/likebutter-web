'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { X, Check, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import { loadPortone } from '@/lib/portone';
import { usePortonePreload } from '@/components/portone/PreloadPortoneProvider';
import {
  createSubscription,
  registerBillingKey,
  getSubscriptionDetails,
} from '@/app/_lib/apis/subscription.api.client';
import { useAuthStore } from '@/stores/authStore';

interface PlanDetails {
  planKey: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  originalPrice?: number;
}

interface StudioCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails;
  lang: string;
}

export default function StudioCheckoutModal({
  isOpen,
  onClose,
  plan,
  lang,
}: StudioCheckoutModalProps) {
  const { t } = useTranslation(['billing', 'common']);
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading'
  );
  const [paymentStep, setPaymentStep] = useState<
    'review' | 'processing' | 'success' | 'error'
  >('review');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      toast.error(t('billing:loginRequiredForPayment'));
      router.push(
        `/${lang}/login?returnTo=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (sdkStatus === 'error') {
      toast.error(t('billing:plans.sdkLoadError'));
      return;
    }

    setIsLoading(true);
    setPaymentStep('processing');

    const loadingToastId = toast.loading(
      t('billing:plans.openingPaymentWindow')
    );

    try {
      let PortOne = getPortone();

      if (!PortOne) {
        console.debug('Falling back to dynamic SDK loading');
        PortOne = await loadPortone();
      }

      const { planKey } = plan;
      if (!planKey) {
        throw new Error(t('billing:planNotAvailableError'));
      }

      localStorage.setItem('selectedPlanKey', planKey);

      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY;
      if (!storeId || !channelKey) {
        throw new Error(t('billing:paymentEnvError'));
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
          `${t('billing:billingKeyError')}: ${
            issueResponse?.message || t('billing:userCancelled')
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

        setPaymentStep('success');

        setTimeout(() => {
          if (latestPayment) {
            router.push(`/${lang}/payments/${latestPayment.paymentId}`);
          } else {
            router.push(`/${lang}/billing/success`);
          }
        }, 2000);
      } else {
        throw new Error(t('billing:subscriptionIdError'));
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      setErrorMessage(error.message);
      setPaymentStep('error');
      toast.error(`${t('billing:genericError')}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const priceWithoutVAT = Math.floor(plan.price / 1.1);
  const vatAmount = plan.price - priceWithoutVAT;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(32, 32, 32, 0.8)' }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg rounded-xl bg-slate-900 border border-slate-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-8">
                {paymentStep === 'review' && (
                  <>
                    {/* Receipt Header */}
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {t('billing:orderSummary')}
                      </h2>
                      <p className="text-slate-400">{t('billing:reviewYourOrder')}</p>
                    </div>

                    {/* Receipt Style Summary */}
                    <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600 mb-6">
                      <div className="space-y-4">
                        {/* Plan Details */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {plan.name}
                            </h3>
                            <p className="text-slate-400 text-sm">
                              {plan.billingCycle === 'monthly'
                                ? t('billing:monthlySubscription')
                                : t('billing:yearlySubscription')}
                            </p>
                          </div>
                        </div>

                        <hr className="border-slate-600" />

                        {/* Subtotal (before VAT) */}
                        <div className="flex justify-between">
                          <span className="text-slate-300">
                            {t('billing:plans.subtotal')}
                          </span>
                          <span className="text-slate-300">
                            {plan.currency}
                            {formatPrice(priceWithoutVAT)}
                          </span>
                        </div>

                        {/* VAT */}
                        <div className="flex justify-between">
                          <span className="text-slate-400">
                            {t('billing:vat')} (10%)
                          </span>
                          <span className="text-slate-400">
                            {plan.currency}
                            {formatPrice(vatAmount)}
                          </span>
                        </div>

                        <hr className="border-slate-600" />

                        {/* Total */}
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">
                            {t('billing:checkout.total')}
                          </span>
                          <span className="text-lg font-bold text-butter-yellow">
                            {plan.currency}
                            {formatPrice(plan.price)}
                          </span>
                        </div>

                        <div className="text-xs text-slate-500 mt-2">
                          {t('billing:vatIncluded')}
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-8">
                      <h4 className="text-white font-medium mb-3">
                        {t('billing:whatsIncluded')}
                      </h4>
                      <div className="space-y-2">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-4 h-4 rounded-full bg-butter-yellow/20 border border-butter-yellow/40 flex items-center justify-center">
                              <Check className="w-3 h-3 text-butter-yellow" />
                            </div>
                            <span className="text-slate-300 text-sm">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {paymentStep === 'processing' && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-300 font-medium">
                      {t('billing:processingPayment')}
                    </p>
                  </div>
                )}

                {paymentStep === 'success' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-400/20 border border-green-400/40 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">
                      {t('billing:paymentSuccessful')}
                    </p>
                    <p className="text-slate-400">
                      {t('billing:redirectingToReceipt')}
                    </p>
                  </div>
                )}

                {paymentStep === 'error' && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-red-400/20 border border-red-400/40 mx-auto mb-4 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-white font-semibold text-lg mb-2">
                      {t('billing:paymentFailed')}
                    </p>
                    <p className="text-red-400 text-sm mb-4">{errorMessage}</p>
                    <button
                      onClick={() => {
                        setPaymentStep('review');
                        setErrorMessage('');
                      }}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {t('billing:tryAgain')}
                    </button>
                  </div>
                )}

                {/* Action Buttons - Only show during review */}
                {paymentStep === 'review' && (
                  <div className="space-y-3">
                    <button
                      onClick={handlePayment}
                      disabled={isLoading || sdkStatus !== 'ready'}
                      className="w-full py-3 px-4 bg-butter-yellow hover:bg-butter-yellow/90 text-black font-semibold rounded-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sdkStatus === 'loading' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('billing:preparingPayment')}
                        </div>
                      ) : (
                        `${t('billing:pay')} ${plan.currency}${formatPrice(plan.price)}`
                      )}
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg border border-slate-600 transition-colors"
                    >
                      {t('common:cancel')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
