'use client';

import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  getMySubscription,
  cancelMySubscription,
} from '@/lib/apis/subscription.api';
import { SubscriptionDetails, PlanKey } from '@/app/_types/subscription';
import { useAuthStore } from '@/app/_stores/authStore';
import { useUIStore } from '@/app/_stores/uiStore';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import ConfirmationModal from '@/components/shared/ConfirmationModal';

const planNames: Record<PlanKey, string> = {
  FREE: 'Free Plan',
  CREATOR_MONTHLY: 'Creator Monthly',
  CREATOR_YEARLY: 'Creator Yearly',
  PROFESSIONAL_MONTHLY: 'Professional Monthly',
  PROFESSIONAL_YEARLY: 'Professional Yearly',
  ENTERPRISE: 'Enterprise',
};

function StatusBadge({ status }: { status: SubscriptionDetails['status'] }) {
  const { t } = useTranslation();
  const statusMap = {
    ACTIVE: {
      text: t('subscriptionManager.statusActive'),
      className: 'bg-green-500/20 text-green-400',
    },
    CANCELLED: {
      text: t('subscriptionManager.statusCancelled'),
      className: 'bg-yellow-500/20 text-yellow-400',
    },
    PAST_DUE: {
      text: t('subscriptionManager.statusPastDue'),
      className: 'bg-red-500/20 text-red-400',
    },
    EXPIRED: {
      text: t('subscriptionManager.statusExpired'),
      className: 'bg-slate-500/20 text-slate-400',
    },
  };
  const currentStatus = statusMap[status] || statusMap.EXPIRED;
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${currentStatus.className}`}
    >
      {currentStatus.text}
    </span>
  );
}

export default function SubscriptionManager() {
  const { t } = useTranslation();
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const { initialize: revalidateUser } = useAuthStore();
  const { closeSettings } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const res = await getMySubscription();
      if (res.data) {
        setSubscription(res.data);
      }
      setError(null);
    } catch (err: any) {
      if (err.status === 404) {
        setSubscription(null);
        setError(null);
      } else {
        setError(err.message || t('subscriptionManager.fetchError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!subscription) return;
    setIsConfirming(true);
    try {
      await cancelMySubscription();
      toast.success(t('subscriptionManager.cancelSuccess'));
      await revalidateUser();
      await fetchSubscription();
      setIsCancelModalOpen(false);
    } catch (err: any) {
      toast.error(`${t('subscriptionManager.cancelError')}: ${err.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleUpgradeClick = () => {
    closeSettings();
    router.push(`/${lang}/billing`);
  };

  const goToPricing = () => {
    closeSettings();
    router.push(`/${lang}/billing`);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 text-studio-text-secondary">
        {t('subscriptionManager.loading')}
      </div>
    );
  }

  if (error) {
    return <div className="text-studio-error text-center p-8">{error}</div>;
  }

  const goToPaymentHistory = () => {
    closeSettings();
    router.push(`/${lang}/billing/history`);
  };

  const isFreePlan = subscription?.planInfo.planKey === 'FREE';

  return (
    <Fragment>
      <div>
        {!subscription || isFreePlan ? (
          <div className="text-center py-8 px-4">
            <p className="text-studio-text-secondary mb-4">
              {t('subscriptionManager.noSubscriptions')}
            </p>
            <button
              onClick={goToPricing}
              className="px-4 py-2 bg-butter-yellow hover:bg-butter-yellow/90 text-black font-medium transition text-sm"
            >
              {t('subscriptionManager.viewPlans')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="py-2">
              <div className="text-sm text-studio-text-secondary mb-1">
                {t('subscriptionManager.plan')}
              </div>
              <div className="text-sm text-studio-text-primary">
                {planNames[subscription.planInfo.planKey] ||
                  subscription.planInfo.planKey}
              </div>
            </div>
            <div className="py-2">
              <div className="text-sm text-studio-text-secondary mb-1">
                {t('subscriptionManager.status')}
              </div>
              <div>
                <StatusBadge status={subscription.status} />
              </div>
            </div>
            <div className="py-2">
              <div className="text-sm text-studio-text-secondary mb-1">
                {t('subscriptionManager.period')}
              </div>
              <div className="text-sm text-studio-text-primary">
                {new Date(subscription.startDate).toLocaleDateString()} -{' '}
                {new Date(subscription.endDate).toLocaleDateString()}
              </div>
            </div>
            {subscription.status === 'ACTIVE' && (
              <div className="pt-4 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  {subscription.planInfo.planKey !== 'PROFESSIONAL_YEARLY' && (
                    <button
                      onClick={() => handleUpgradeClick()}
                      className="px-3 py-1.5 bg-transparent border border-butter-yellow hover:bg-butter-yellow/10 rounded-full transition text-butter-yellow text-xs font-medium"
                    >
                      {t('subscriptionManager.upgrade')}
                    </button>
                  )}
                  <button
                    onClick={goToPaymentHistory}
                    className="px-3 py-1.5 bg-transparent border border-white/[0.15] hover:bg-white/[0.05] rounded-full transition text-white text-xs font-medium"
                  >
                    {t('paymentHistory.title')}
                  </button>
                </div>
                <button
                  onClick={() => handleCancelClick()}
                  className="px-3 py-1.5 bg-transparent border border-red-500/40 hover:bg-red-500/10 rounded-full transition text-red-400 text-xs font-medium"
                >
                  {t('subscriptionManager.cancelSubscription')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        title={t('subscriptionManager.cancelTitle')}
        message={
          subscription
            ? t('subscriptionManager.cancelConfirm', {
                endDate: new Date(subscription.endDate).toLocaleDateString(),
              })
            : ''
        }
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsCancelModalOpen(false)}
        confirmText={t('subscriptionManager.confirmCancelText')}
        cancelText={t('subscriptionManager.cancelText')}
        isConfirming={isConfirming}
      />
    </Fragment>
  );
}
