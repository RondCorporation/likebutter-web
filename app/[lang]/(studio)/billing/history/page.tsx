'use client';

import { useEffect, useState } from 'react';
import { getPaymentHistory } from '@/app/_lib/apis/payment.api.client';
import { PaymentHistoryResponse } from '@/app/_types/payment';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import '@/app/_lib/i18n-client';
import { useParams } from 'next/navigation';
import StudioOverlay from '@/components/studio/StudioOverlay';
import DataTable from '@/components/shared/DataTable';
import StudioButton from '@/components/shared/StudioButton';
import { Receipt, Eye } from 'lucide-react';

export default function PaymentHistoryPage() {
  const params = useParams();
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

  const columns = [
    {
      key: 'paidAt',
      title: t('paymentHistory.date'),
      width: '180px',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'orderName',
      title: t('paymentHistory.order'),
      width: '200px',
    },
    {
      key: 'planName',
      title: t('paymentHistory.plan'),
      width: '150px',
    },
    {
      key: 'amount',
      title: t('paymentHistory.amount'),
      width: '150px',
      render: (value: number, row: PaymentHistoryResponse) =>
        `${value.toLocaleString()} ${row.currency}`,
    },
    {
      key: 'status',
      title: t('paymentHistory.status'),
      width: '100px',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'PAID'
              ? 'bg-green-400/20 text-green-400'
              : 'bg-red-400/20 text-red-400'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'actions',
      title: '',
      width: '120px',
      render: (_: any, row: PaymentHistoryResponse) => (
        <Link href={`/${lang}/payments/${row.paymentId}`}>
          <StudioButton
            variant="ghost"
            size="sm"
            icon={<Eye size={14} />}
            className="text-butter-yellow hover:text-butter-yellow/80"
          >
            {t('paymentHistory.viewReceipt')}
          </StudioButton>
        </Link>
      ),
    },
  ];

  return (
    <StudioOverlay
      title={t('paymentHistory.title')}
      backUrl={`/${lang}/studio`}
    >
      <div className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-400">
            {error}
          </div>
        )}

        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          emptyMessage={t('paymentHistory.noPayments')}
        />
      </div>
    </StudioOverlay>
  );
}
