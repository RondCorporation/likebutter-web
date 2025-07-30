'use client';

import { useEffect, useState } from 'react';
import { getPaymentHistory } from '@/app/_lib/apis/payment.api.client';
import { PaymentHistoryResponse } from '@/app/_types/payment';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '@/app/_lib/i18n-client';
import { useParams } from 'next/navigation';

export default function PaymentHistoryPage() {
  const params = useParams();
  const { t } = useTranslation('common');

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

  return (
    <div className="container mx-auto min-h-screen bg-black p-4 pt-24 text-white md:p-8 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">{t('paymentHistory.title')}</h1>
        {loading && <p>{t('loading')}</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && payments.length === 0 && (
          <p className="text-slate-400">{t('paymentHistory.noPayments')}</p>
        )}
        {!loading && !error && payments.length > 0 && (
          <div className="bg-white/5 rounded-lg border border-white/10">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    {t('paymentHistory.date')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('paymentHistory.order')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('paymentHistory.plan')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('paymentHistory.amount')}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t('paymentHistory.status')}
                  </th>

                  <th scope="col" className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.paymentId}
                    className="border-b border-white/10 hover:bg-white/10"
                  >
                    <td className="px-6 py-4">
                      {new Date(p.paidAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{p.orderName}</td>
                    <td className="px-6 py-4">{p.planName}</td>
                    <td className="px-6 py-4">{`${p.amount.toLocaleString()} ${
                      p.currency
                    }`}</td>
                    <td className="px-6 py-4">{p.status}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${params.lang}/payments/${p.paymentId}`}
                        className="font-medium text-accent hover:underline"
                      >
                        {t('paymentHistory.viewReceipt')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
