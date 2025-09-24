'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import {
  registerBillingKey,
  createSubscription,
} from '@/app/_lib/apis/subscription.api.client';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initialize: revalidateUser } = useAuthStore.getState();
  const lang = searchParams.get('lang') || 'ko';
  const { t } = useTranslation(['billing']);

  useEffect(() => {
    const processPayment = async () => {
      const success = searchParams.get('success');
      const billingKey = searchParams.get('billing_key');
      const imp_uid = searchParams.get('imp_uid');
      const errorMsg = searchParams.get('error_msg');
      const planKey = localStorage.getItem('selectedPlanKey');

      if (success === 'true' && billingKey && planKey) {
        try {
          await registerBillingKey(billingKey);

          const createSubResponse = await createSubscription(planKey);

          if (createSubResponse.data?.subscriptionId) {
            toast.success(t('payment.success.subscriptionStarted'));
            await revalidateUser();
            router.replace(
              `/${lang}/billing/success?plan=${planKey.split('_')[0].toLowerCase()}&subscription=${createSubResponse.data.subscriptionId}`
            );
          } else {
            throw new Error(t('payment.errors.subscriptionFailed'));
          }
        } catch (e: any) {
          toast.error(
            t('payment.errors.processingError', { message: e.message })
          );
          router.replace(`/${lang}/billing?error=processing_failed`);
        } finally {
          localStorage.removeItem('selectedPlanKey');
        }
      } else {
        toast.error(
          t('payment.errors.paymentFailedWithMessage', {
            message: errorMsg || t('payment.errors.unknownError'),
          })
        );
        router.replace(`/${lang}/billing?error=payment_failed`);
      }
    };

    processPayment();
  }, [router, searchParams, lang, revalidateUser, t]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
      <Loader2 className="w-12 h-12 animate-spin text-butter-yellow" />
      <p className="text-lg">{t('checkout.processingPayment')}</p>
    </div>
  );
}

export default function BillingCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Suspense fallback={<div>Loading...</div>}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
