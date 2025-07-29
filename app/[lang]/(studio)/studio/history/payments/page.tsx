import initTranslations from '@/lib/i18n-server';
import { getPaymentHistory } from '@/app/_lib/apis/payment.api';
import { PaymentHistoryResponse } from '@/app/_types/payment';
import Link from 'next/link';

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function PaymentHistoryPage({ params }: Props) {
  const { lang } = await params;
  const { t } = await initTranslations(lang, ['common']);

  let payments: PaymentHistoryResponse[] = [];
  let error: string | null = null;

  try {
    const res = await getPaymentHistory();
    if (res.data) {
      payments = res.data;
    }
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">{t('paymentHistory.title')}</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!error && payments.length === 0 && (
        <p className="text-slate-400">{t('paymentHistory.noPayments')}</p>
      )}
      {!error && payments.length > 0 && (
        <div className="bg-white/5 rounded-lg border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-white/5">
              <tr>
                <th scope="col" className="px-6 py-3">{t('paymentHistory.date')}</th>
                <th scope="col" className="px-6 py-3">{t('paymentHistory.order')}</th>
                <th scope="col" className="px-6 py-3">{t('paymentHistory.plan')}</th>
                <th scope="col" className="px-6 py-3">{t('paymentHistory.amount')}</th>
                <th scope="col" className="px-6 py-3">{t('paymentHistory.status')}</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.paymentId} className="border-b border-white/10 hover:bg-white/10">
                  <td className="px-6 py-4">{new Date(p.paidAt).toLocaleString()}</td>
                  <td className="px-6 py-4">{p.orderName}</td>
                  <td className="px-6 py-4">{p.planName}</td>
                  <td className="px-6 py-4">{`${p.amount.toLocaleString()} ${p.currency}`}</td>
                  <td className="px-6 py-4">{p.status}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/${lang}/payments/${p.paymentId}`} className="font-medium text-accent hover:underline">
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
  );
}
