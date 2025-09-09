'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import StudioOverlay from '@/components/studio/StudioOverlay';
import OverlayCheckoutClient from './OverlayCheckoutClient';

type PlanForCheckout = {
  name: string;
  priceFormatted: string;
  features: string[];
  planKey: string;
};

interface CheckoutOverlayProps {
  lang: string;
  plan: PlanForCheckout;
}

export default function CheckoutOverlay({ lang, plan }: CheckoutOverlayProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleClose = () => {
    if (isAuthenticated) {
      router.push(`/${lang}/studio`);
    } else {
      router.push(`/${lang}`);
    }
  };

  return (
    <StudioOverlay
      title={`${plan.name} 구독`}
      onClose={handleClose}
      backUrl={isAuthenticated ? `/${lang}/studio` : `/${lang}`}
    >
      <OverlayCheckoutClient lang={lang} plan={plan} />
    </StudioOverlay>
  );
}
