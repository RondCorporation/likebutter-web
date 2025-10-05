'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import StudioOverlay from '@/components/studio/StudioOverlay';
import OverlayCheckoutClient from './OverlayCheckoutClient';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(['billing']);

  const handleClose = () => {
    if (isAuthenticated) {
      router.push(`/${lang}/studio`);
    } else {
      router.push(`/${lang}`);
    }
  };

  return (
    <StudioOverlay
      title={t('subscription.subscribeToPlan', { planName: plan.name })}
      onClose={handleClose}
      backUrl={isAuthenticated ? `/${lang}/studio` : `/${lang}`}
    >
      <OverlayCheckoutClient lang={lang} plan={plan} />
    </StudioOverlay>
  );
}
