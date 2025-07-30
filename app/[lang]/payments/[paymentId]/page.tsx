import initTranslations from '@/lib/i18n-server';
import { getPaymentHistory } from '@/app/_lib/apis/payment.api.server';
import { PaymentHistoryResponse } from '@/app/_types/payment';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ lang: string; paymentId: string }>;
};

export default async function PaymentReceiptPage({ params }: Props) {
  const { lang, paymentId } = await params;
  const { t } = await initTranslations(lang, ['common']);

  let payment: PaymentHistoryResponse | undefined;
  let error: string | null = null;

  try {
    const res = await getPaymentHistory();
    if (res.data) {
      payment = res.data.find((p) => p.paymentId.toString() === paymentId);
    }
    if (!payment) {
      notFound();
    }
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold mb-6">{t('receipt.errorTitle')}</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!payment) {
    return null; // notFound() will be handled by Next.js
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/5 rounded-lg border border-white/10 p-8">
        <h1 className="text-2xl font-bold mb-2 text-accent">{t('receipt.title')}</h1>
        <p className="text-sm text-slate-400 mb-8">{t('receipt.subtitle')}</p>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">{t('receipt.paymentId')}</span>
            <span>{payment.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('receipt.pgTxId')}</span>
            <span>{payment.pgTxId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('receipt.paidAt')}</span>
            <span>{new Date(payment.paidAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('receipt.orderName')}</span>
            <span>{payment.orderName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">{t('receipt.planName')}</span>
            <span>{payment.planName}</span>
          </div>
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
            <span className="text-base font-semibold">{t('receipt.totalAmount')}</span>
            <span className="text-xl font-bold text-accent">{`${payment.amount.toLocaleString()} ${payment.currency}`}</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href={`/${lang}/studio/history/payments`} className="text-accent hover:underline">
            {t('receipt.backToList')}
          </Link>
        </div>
      </div>
    </div>
  );
}
