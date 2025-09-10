'use client';

import { useParams, useSearchParams } from 'next/navigation';
import SuccessCelebration from '../_components/SuccessCelebration';

const PaymentSuccessPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = params.lang as string || 'ko';
  
  const planName = searchParams.get('plan') || 'creator';
  const subscriptionId = searchParams.get('subscription');

  return (
    <SuccessCelebration 
      lang={lang}
      planName={planName}
      subscriptionId={subscriptionId || undefined}
    />
  );
};

export default PaymentSuccessPage;
