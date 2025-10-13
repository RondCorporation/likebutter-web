'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SubscriptionPaymentDetails } from '@/app/_types/subscription';

interface PaymentReceiptClientProps {
  lang: string;
  paymentData: SubscriptionPaymentDetails;
}

export default function PaymentReceiptClient({
  lang,
  paymentData,
}: PaymentReceiptClientProps) {
  const { t } = useTranslation(['billing', 'common']);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === 'ko' ? 'ko-KR' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency === 'KRW' ? '₩' : '$'}${amount.toLocaleString()}`;
  };

  const subtotal = Math.floor(paymentData.amount / 1.1);
  const vat = paymentData.amount - subtotal;

  // Extract billing cycle from planKey (e.g., "CREATOR_YEARLY" -> "YEARLY")
  const billingCycle = paymentData.plan.planKey.includes('MONTHLY')
    ? 'MONTHLY'
    : paymentData.plan.planKey.includes('YEARLY')
    ? 'YEARLY'
    : 'MONTHLY';

  const statusColors = {
    PAID: 'bg-butter-yellow/20 text-butter-yellow border-butter-yellow/40',
    FAILED: 'bg-red-400/20 text-red-400 border-red-400/40',
    CANCELLED: 'bg-slate-400/20 text-slate-400 border-slate-400/40',
    PENDING: 'bg-amber-400/20 text-amber-400 border-amber-400/40',
  };

  const statusText = {
    PAID: t('billing:paymentStatus.paid'),
    FAILED: t('billing:paymentStatus.failed'),
    CANCELLED: t('billing:paymentStatus.cancelled'),
    PENDING: t('billing:paymentStatus.pending'),
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#202020' }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 md:py-16">
        {/* Back Button - Studio Style */}
        <div className="mb-6 md:mb-0">
          <button
            onClick={() => router.push(`/${lang}/studio`)}
            className="inline-flex items-center text-slate-400 hover:text-butter-yellow transition-colors group"
          >
            <svg
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {t('billing:backToStudio')}
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('billing:receipt.paymentComplete')}
                </h1>
                <p className="text-slate-400">
                  {t('billing:receipt.thankYouForPayment')}
                </p>
              </div>
            </motion.div>

            {/* Receipt Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-slate-700 rounded-lg"
              style={{ backgroundColor: '#25282c' }}
            >
              {/* Receipt Header */}
              <div className="px-6 py-4 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">
                    {t('billing:receipt.title')}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      statusColors[paymentData.status]
                    }`}
                  >
                    {statusText[paymentData.status]}
                  </span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Plan Information */}
                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">
                      {t('billing:receipt.plan')}
                    </span>
                    <span className="text-white font-medium">
                      {paymentData.plan.name}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">
                      {t('billing:receipt.billingCycle')}
                    </span>
                    <span className="text-white font-medium">
                      {billingCycle === 'MONTHLY'
                        ? t('billing:monthly')
                        : t('billing:yearly')}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">
                      {t('billing:receipt.paidAt')}
                    </span>
                    <span className="text-white font-medium">
                      {formatDate(paymentData.paidAt)}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">
                      {t('billing:receipt.transactionId')}
                    </span>
                    <span className="text-white font-medium text-sm break-all">
                      {paymentData.pgTxId}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400">
                      {t('billing:receipt.orderId')}
                    </span>
                    <span className="text-white font-medium">
                      {paymentData.paymentId}
                    </span>
                  </div>

                  {/* Amount Breakdown */}
                  <div className="pt-4 mt-2">
                    <div className="flex justify-between py-3 border-b border-slate-700">
                      <span className="text-slate-400">
                        {t('billing:plans.subtotal')}
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(subtotal, paymentData.currency)}
                      </span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-slate-700">
                      <span className="text-slate-400">
                        {t('billing:vat')} (10%)
                      </span>
                      <span className="text-white font-medium">
                        {formatCurrency(vat, paymentData.currency)}
                      </span>
                    </div>

                    <div className="flex justify-between py-4 mt-2">
                      <span className="text-lg font-semibold text-white">
                        {t('billing:checkout.total')}
                      </span>
                      <span className="text-2xl font-bold text-butter-yellow">
                        {formatCurrency(paymentData.amount, paymentData.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
