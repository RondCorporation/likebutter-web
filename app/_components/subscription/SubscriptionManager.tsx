'use client';

import { useState, useEffect, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  getSubscriptions,
  cancelSubscription,
  upgradeSubscription,
  getSubscriptionDetails,
} from '@/lib/apis/subscription.api';
import {
  Subscription,
  SubscriptionDetails,
  PlanKey,
} from '@/app/_types/subscription';
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

const allPaidPlans: PlanKey[] = [
  'CREATOR_MONTHLY',
  'CREATOR_YEARLY',
  'PROFESSIONAL_MONTHLY',
  'PROFESSIONAL_YEARLY',
];

const getAvailableUpgrades = (currentPlan: PlanKey): PlanKey[] => {
  switch (currentPlan) {
    case 'FREE':
      return allPaidPlans;
    case 'CREATOR_MONTHLY':
      return ['CREATOR_YEARLY', 'PROFESSIONAL_MONTHLY', 'PROFESSIONAL_YEARLY'];
    case 'CREATOR_YEARLY':
      return ['PROFESSIONAL_YEARLY'];
    case 'PROFESSIONAL_MONTHLY':
      return ['PROFESSIONAL_YEARLY'];
    default:
      return [];
  }
};

function StatusBadge({ status }: { status: Subscription['status'] }) {
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

// A simple modal for upgrade and details
function SubscriptionModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default function SubscriptionManager() {
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<
    'upgrade' | 'details' | 'cancel' | null
  >(null);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const { initialize: revalidateUser } = useAuthStore();
  const { closeSettings } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const res = await getSubscriptions();
      if (res.data) {
        setSubscriptions(
          res.data.sort(
            (a, b) =>
              new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          )
        );
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || t('subscriptionManager.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleCancelClick = (sub: Subscription) => {
    setSelectedSub(sub);
    setModalContent('cancel');
    setIsModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedSub) return;
    setIsConfirming(true);
    try {
      await cancelSubscription(selectedSub.subscriptionId);
      toast.success(t('subscriptionManager.cancelSuccess'));
      await revalidateUser();
      await fetchSubscriptions();
      closeModal();
    } catch (err: any) {
      toast.error(`${t('subscriptionManager.cancelError')}: ${err.message}`);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleUpgradeClick = (sub: Subscription) => {
    setSelectedSub(sub);
    setModalContent('upgrade');
    setIsModalOpen(true);
  };

  const handleDetailsClick = async (sub: Subscription) => {
    setSelectedSub(sub);
    setModalContent('details');
    setIsModalOpen(true);
    setDetails(null); // Clear previous details
    try {
      const res = await getSubscriptionDetails(sub.subscriptionId);
      if (res.data) {
        setDetails(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || t('subscriptionManager.fetchDetailsError'));
    }
  };

  const handleUpgrade = async (newPlanKey: PlanKey) => {
    if (!selectedSub) return;
    try {
      await upgradeSubscription(selectedSub.subscriptionId, newPlanKey);
      toast.success(t('subscriptionManager.upgradeSuccess'));
      setIsModalOpen(false);
      await revalidateUser();
      await fetchSubscriptions();
    } catch (err: any) {
      toast.error(`${t('subscriptionManager.upgradeError')}: ${err.message}`);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setSelectedSub(null);
    setDetails(null);
  };

  const goToPricing = () => {
    closeSettings();
    router.push(`/${lang}/pricing`);
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">{t('subscriptionManager.loading')}</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">{error}</div>;
  }

  return (
    <Fragment>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {t('settingsSubscriptionTitle')}
          </h3>
          <button
            onClick={goToPricing}
            className="text-sm font-medium text-accent hover:text-yellow-300 transition"
          >
            {t('subscriptionManager.viewPlans')}
          </button>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/5 rounded-md">
            <p className="text-slate-400">
              {t('subscriptionManager.noSubscriptions')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div
                key={sub.subscriptionId}
                className="p-4 bg-white/5 rounded-md text-sm"
              >
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="font-semibold text-base">
                      {planNames[sub.planKey] || sub.planKey}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={sub.status} />
                      <p className="text-xs text-slate-400">
                        {t('subscriptionManager.period')}:{' '}
                        {new Date(sub.startDate).toLocaleDateString()} -{' '}
                        {new Date(sub.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDetailsClick(sub)}
                      className="px-3 py-1.5 bg-slate-600/50 hover:bg-slate-500/50 rounded-md transition"
                    >
                      {t('subscriptionManager.details')}
                    </button>
                    {sub.status === 'ACTIVE' &&
                      getAvailableUpgrades(sub.planKey).length > 0 && (
                        <button
                          onClick={() => handleUpgradeClick(sub)}
                          className="px-3 py-1.5 bg-accent/80 hover:bg-accent rounded-md transition"
                        >
                          {t('subscriptionManager.upgrade')}
                        </button>
                      )}
                    {sub.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleCancelClick(sub)}
                        className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-600 rounded-md transition"
                      >
                        {t('subscriptionManager.cancelAction')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && modalContent !== 'cancel' && selectedSub && (
        <SubscriptionModal
          title={
            modalContent === 'upgrade'
              ? t('subscriptionManager.upgradeTitle')
              : t('subscriptionManager.detailsTitle')
          }
          onClose={closeModal}
        >
          {modalContent === 'upgrade' && (
            <div>
              <p className="mb-4">
                {t('subscriptionManager.currentPlan')}:{' '}
                <strong>{planNames[selectedSub.planKey]}</strong>
              </p>
              <p className="mb-4">{t('subscriptionManager.selectUpgrade')}</p>
              <div className="flex flex-col space-y-2">
                {getAvailableUpgrades(selectedSub.planKey).map((planKey) => (
                  <button
                    key={planKey}
                    onClick={() => handleUpgrade(planKey)}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md transition text-white font-semibold"
                  >
                    {planNames[planKey]}
                  </button>
                ))}
              </div>
            </div>
          )}
          {modalContent === 'details' && (
            <div>
              {!details ? (
                <p>{t('subscriptionManager.loadingDetails')}</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>{t('subscriptionManager.plan')}:</strong>{' '}
                    {details.planInfo.description}
                  </p>
                  <p>
                    <strong>{t('subscriptionManager.status')}:</strong>{' '}
                    {details.status}
                  </p>
                  <p>
                    <strong>{t('subscriptionManager.term')}:</strong>{' '}
                    {new Date(details.startDate).toLocaleString()} -{' '}
                    {new Date(details.endDate).toLocaleString()}
                  </p>
                  <p>
                    <strong>{t('subscriptionManager.nextPayment')}:</strong>{' '}
                    {new Date(details.nextPaymentDate).toLocaleDateString()}
                  </p>
                  <h5 className="font-semibold pt-4 mb-2">
                    {t('subscriptionManager.paymentHistory')}
                  </h5>
                  {details.paymentHistory.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {details.paymentHistory.map((p) => (
                        <li key={p.paymentId}>
                          {new Date(p.paidAt).toLocaleString()}: $
                          {p.amount.toFixed(2)} ({p.status})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400">
                      {t('subscriptionManager.noPaymentHistory')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </SubscriptionModal>
      )}

      <ConfirmationModal
        isOpen={isModalOpen && modalContent === 'cancel'}
        title={t('subscriptionManager.cancelTitle')}
        message={t('subscriptionManager.cancelConfirm')}
        onConfirm={handleConfirmCancel}
        onCancel={closeModal}
        confirmText={t('subscriptionManager.cancelAction')}
        isConfirming={isConfirming}
      />
    </Fragment>
  );
}
