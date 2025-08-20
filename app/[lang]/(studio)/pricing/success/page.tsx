'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const params = useParams();
  const lang = params.lang || 'ko';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-accent">
          결제 정보가 등록되었습니다
        </h1>
        <p className="mt-2 text-lg text-slate-300">
          구독이 성공적으로 처리되었습니다. 이제 모든 기능을 이용하실 수
          있습니다.
        </p>
        <div className="mt-8">
          <Link
            href={`/${lang}/studio`}
            className="rounded-md bg-accent px-6 py-3 text-lg font-semibold text-black transition hover:brightness-90"
          >
            스튜디오로 이동
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
