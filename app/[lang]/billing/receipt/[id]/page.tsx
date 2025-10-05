'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSubscriptionPaymentDetails } from '@/lib/apis/subscription.api';
import PaymentReceiptClient from './_components/PaymentReceiptClient';
import { SubscriptionPaymentDetails } from '@/app/_types/subscription';
import { Loader2 } from 'lucide-react';

export default function PaymentReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const lang = (params.lang as string) || 'ko';
  const id = params.id as string;

  const [paymentData, setPaymentData] =
    useState<SubscriptionPaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentId = parseInt(id, 10);

    if (isNaN(paymentId)) {
      router.push(`/${lang}/billing/history`);
      return;
    }

    getSubscriptionPaymentDetails(paymentId)
      .then((response) => {
        if (response.data) {
          setPaymentData(response.data);
        } else {
          setError('Payment not found');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch payment details:', err);
        setError(err.message || 'Failed to load payment details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, lang, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-butter-yellow mx-auto" />
          <p className="text-slate-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-16 h-16 rounded-full bg-red-400/20 border-2 border-red-400/40 mx-auto flex items-center justify-center">
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-bold text-white">Payment Not Found</h2>
          <p className="text-slate-400">
            {error || 'Unable to load payment details'}
          </p>
          <button
            onClick={() => router.push(`/${lang}/billing/history`)}
            className="bg-butter-yellow hover:bg-butter-yellow/90 text-black font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Back to Payment History
          </button>
        </div>
      </div>
    );
  }

  return <PaymentReceiptClient lang={lang} paymentData={paymentData} />;
}
