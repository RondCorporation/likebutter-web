'use client';

import { useEffect, useState } from 'react';
import { getPaymentHistory } from '@/lib/apis/payment.api';
import { PaymentHistoryResponse } from '@/app/_types/payment';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '@/app/_lib/i18n-client';
import { useParams, useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';

export default function PaymentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation('billing');

  const [payments, setPayments] = useState<PaymentHistoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentHistory()
      .then((res) => {
        if (res.data) {
          setPayments(res.data);
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch payment history.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const lang = params.lang;

  const formatCurrency = (amount: number, currency: string) => {
    return `${currency === 'KRW' ? '₩' : '$'}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      lang === 'ko' ? 'ko-KR' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
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
            {t('backToStudio')}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 md:mb-4">
            {t('paymentHistory.title')}
          </h1>
        </div>

        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400">
              {t('common:loading')}
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              {t('paymentHistory.noPayments')}
            </div>
          ) : (
            <div
              className="border border-slate-700 rounded-lg overflow-hidden"
              style={{ backgroundColor: '#25282c' }}
            >
              {/* Table Header */}
              <div
                className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-slate-700"
                style={{ backgroundColor: '#25282c' }}
              >
                <div className="col-span-3 text-sm font-medium text-slate-300">
                  {t('paymentHistory.date')}
                </div>
                <div className="col-span-3 text-sm font-medium text-slate-300">
                  {t('paymentHistory.plan')}
                </div>
                <div className="col-span-2 text-sm font-medium text-slate-300">
                  {t('paymentHistory.amount')}
                </div>
                <div className="col-span-2 text-sm font-medium text-slate-300">
                  {t('paymentHistory.status')}
                </div>
                <div className="col-span-2"></div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-700">
                {payments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    className="px-6 py-4 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Date */}
                      <div className="col-span-1 md:col-span-3">
                        <div className="md:hidden text-xs text-slate-400 mb-1">
                          {t('paymentHistory.date')}
                        </div>
                        <div className="text-white font-medium">
                          {formatDate(payment.paidAt)}
                        </div>
                      </div>

                      {/* Plan */}
                      <div className="col-span-1 md:col-span-3">
                        <div className="md:hidden text-xs text-slate-400 mb-1">
                          {t('paymentHistory.plan')}
                        </div>
                        <div className="text-white">{payment.planName}</div>
                      </div>

                      {/* Amount */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="md:hidden text-xs text-slate-400 mb-1">
                          {t('paymentHistory.amount')}
                        </div>
                        <div className="text-white font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-1 md:col-span-2">
                        <div className="md:hidden text-xs text-slate-400 mb-1">
                          {t('paymentHistory.status')}
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                            payment.status === 'PAID'
                              ? 'bg-butter-yellow/20 text-butter-yellow'
                              : 'bg-red-400/20 text-red-400'
                          }`}
                        >
                          {payment.status === 'PAID'
                            ? t('paymentStatus.paid')
                            : t('paymentStatus.failed')}
                        </span>
                      </div>

                      {/* Action */}
                      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-end">
                        <Link
                          href={`/${lang}/billing/receipt/${payment.paymentId}`}
                          className="inline-flex items-center gap-2 text-butter-yellow hover:text-butter-yellow/80 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          {t('paymentHistory.viewReceipt')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
