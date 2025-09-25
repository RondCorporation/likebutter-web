'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  X,
  User,
  Bell,
  Settings as SettingsIcon,
  CreditCard,
  ChevronDown,
  Receipt,
  Download,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';
import { useCredit } from '@/hooks/useCredit';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { getPaymentHistory } from '@/lib/apis/payment.api.client';
import { PaymentHistoryResponse } from '@/types/payment';
import SubscriptionManager from './subscription/SubscriptionManager';

function AccountSettings() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const { t } = useTranslation();
  const { currentBalance, isLoading: isCreditLoading } = useCredit();
  const { hasAttendedToday, isLoading: isAttendanceLoading } = useAttendanceStore();

  if (!user) {
    return <p className="text-studio-text-secondary">{t('settingsLoading')}</p>;
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold md:mb-6 md:text-xl">
        {t('settingsAccountInfo')}
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
          <span className="text-studio-text-secondary">{t('settingsAccountEmail')}</span>
          <span className="font-medium text-studio-text-primary">{user.email}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
          <span className="text-studio-text-secondary">{t('settingsAccountName')}</span>
          <span className="font-medium text-studio-text-primary">{user.name}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
          <span className="text-studio-text-secondary">{t('settingsAccountPhone')}</span>
          <span className="font-medium text-studio-text-primary">
            {user.phoneNumber || t('settingsNotProvided')}
          </span>
        </div>
      </div>

      {/* Account Statistics */}
      <div className="mt-8">
        <h4 className="mb-4 text-base font-semibold md:text-lg">
          {t('settingsAccountStats')}
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
            <span className="text-studio-text-secondary">{t('settingsAccountPlan')}</span>
            <span className="font-medium text-studio-text-primary">
              Basic Plan
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
            <span className="text-studio-text-secondary">{t('settingsAccountCredits')}</span>
            <span className="font-medium text-studio-text-primary">
              {isCreditLoading ? '...' : currentBalance.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
            <span className="text-studio-text-secondary">{t('settingsAccountAttendance')}</span>
            <span className={`font-medium ${hasAttendedToday ? 'text-studio-success' : 'text-studio-text-secondary'}`}>
              {isAttendanceLoading ? '...' : hasAttendedToday ? t('settingsAttendanceCompleted') : t('settingsAttendanceNotCompleted')}
            </span>
          </div>
          <div className="flex flex-col gap-1 rounded-md bg-studio-sidebar py-3 px-4 border border-studio-border md:flex-row md:items-center md:justify-between md:py-4 md:px-6">
            <span className="text-studio-text-secondary">{t('settingsAccountJoinDate')}</span>
            <span className="font-medium text-studio-text-primary">
              {(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : t('settingsNotProvided')}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-8 w-full rounded-md bg-red-600/80 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 md:mt-10"
      >
        {t('dropdownLogout')}
      </button>
    </div>
  );
}

function GeneralSettings() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLang: string) => {
    const currentLang = i18n.language;
    setIsOpen(false);
    if (newLang !== currentLang) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      document.cookie = `i18next=${newLang};path=/;max-age=31536000`;
      router.push(newPath);
    }
  };

  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
  ];

  const currentLanguageName =
    languages.find((l) => l.code === i18n.language)?.name || i18n.language;

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold md:mb-6 md:text-xl">
        {t('settingsTabGeneral')}
      </h3>
      <div className="space-y-2">
        <label
          id="language-dropdown-label"
          className="mb-2 block text-sm text-studio-text-secondary"
        >
          {t('settingsLanguage')}
        </label>
        <div className="relative w-full max-w-xs">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-labelledby="language-dropdown-label"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-md border border-studio-border bg-studio-sidebar px-3 py-2 text-studio-text-primary transition hover:bg-studio-button-primary/10 focus:border-studio-button-primary focus:outline-none focus:ring-1 focus:ring-studio-button-primary"
          >
            <span>{currentLanguageName}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <ul
              className="absolute z-10 mt-1 w-full rounded-md border border-studio-border bg-studio-sidebar py-1 shadow-lg"
              role="listbox"
            >
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm text-studio-text-primary hover:bg-studio-button-primary hover:text-studio-header transition-colors"
                  role="option"
                  aria-selected={i18n.language === lang.code}
                >
                  {lang.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SubscriptionSettings() {
  return <SubscriptionManager />;
}

function PaymentHistorySettings() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getPaymentHistory();

        if (response.status === 200 && response.data) {
          setPaymentHistory(response.data);
        } else {
          throw new Error('Failed to fetch payment history');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch payment history');
        console.error('Payment history fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-studio-success';
      case 'FAILED':
        return 'text-studio-error';
      case 'PENDING':
        return 'text-studio-warning';
      case 'CANCELLED':
        return 'text-studio-text-secondary';
      default:
        return 'text-studio-text-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return t('paymentHistory.paymentSuccessful');
      case 'FAILED':
        return t('paymentHistory.paymentFailed');
      case 'PENDING':
        return t('paymentHistory.paymentPending');
      case 'CANCELLED':
        return t('cancelled');
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-8 text-studio-text-secondary">
        {t('paymentHistory.loadingHistory')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-studio-error">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold md:mb-6 md:text-xl">
        {t('paymentHistory.title')}
      </h3>

      {paymentHistory.length === 0 ? (
        <div className="text-center py-10 px-4 bg-studio-sidebar rounded-md border border-studio-border">
          <Receipt className="w-12 h-12 mx-auto mb-4 text-studio-text-secondary" />
          <p className="text-studio-text-secondary">
            {t('paymentHistory.noHistory')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentHistory.map((payment: PaymentHistoryResponse) => (
            <div
              key={payment.paymentId}
              className="p-4 bg-studio-sidebar rounded-md border border-studio-border"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Receipt className="w-5 h-5 text-studio-text-secondary" />
                    <h4 className="font-semibold text-studio-text-primary">
                      {payment.orderName || payment.planName}
                    </h4>
                  </div>
                  <div className="space-y-1 text-sm text-studio-text-secondary">
                    <p>{t('paymentHistory.date')}: {new Date(payment.paidAt).toLocaleDateString()}</p>
                    <p>ID: {payment.pgTxId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xl font-bold text-studio-text-primary">
                      {payment.currency === 'KRW' ? '₩' : '$'}{payment.amount.toLocaleString()}
                    </div>
                    <div className={`text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 bg-studio-border hover:bg-studio-border-light rounded-md transition text-studio-text-primary text-sm">
                    <Download className="w-4 h-4" />
                    {t('paymentHistory.downloadReceipt')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SettingsModal() {
  const { isSettingsOpen, closeSettings, initialSettingsTab } = useUIStore();
  const [activeTab, setActiveTab] = useState(initialSettingsTab);
  const { t } = useTranslation();

  useEffect(() => {
    if (isSettingsOpen) {
      setActiveTab(initialSettingsTab);
    }
  }, [isSettingsOpen, initialSettingsTab]);

  const TABS = [
    { id: 'account', label: t('settingsTabAccount'), icon: User },
    {
      id: 'subscription',
      label: t('settingsTabSubscription'),
      icon: CreditCard,
    },
    { id: 'payment-history', label: t('settingsTabPaymentHistory'), icon: Receipt },
    { id: 'general', label: t('settingsTabGeneral'), icon: SettingsIcon },
    { id: 'notifications', label: t('settingsTabNotifications'), icon: Bell },
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm md:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-none border border-studio-border bg-studio-main text-studio-text-primary shadow-2xl md:h-[70vh] md:max-w-4xl md:flex-row md:rounded-lg">
        <button
          onClick={closeSettings}
          className="absolute top-4 right-4 z-50 text-studio-text-secondary hover:text-studio-text-primary transition-colors"
        >
          <X size={20} />
        </button>

        {/* Desktop Sidebar */}
        <aside className="hidden w-56 flex-shrink-0 space-y-1 border-r border-studio-border bg-studio-sidebar p-6 pt-8 md:flex md:flex-col">
          <h2 className="mb-6 px-3 text-lg font-semibold">
            {t('settingsTitle')}
          </h2>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-studio-button-primary/10 ${
                activeTab === id
                  ? 'bg-studio-button-primary/20 font-medium text-studio-button-primary'
                  : 'text-studio-text-secondary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        {/* Mobile Tabs */}
        <div className="border-b border-studio-border p-4 pt-6 md:hidden">
          <h2 className="mb-4 text-center text-lg font-semibold">
            {t('settingsTitle')}
          </h2>
          <div className="flex justify-around">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 p-2 text-xs transition-colors ${
                  activeTab === id ? 'text-studio-button-primary' : 'text-studio-text-secondary'
                }`}
              >
                <Icon size={20} />
                <span>
                  {t(`settingsTab${id.charAt(0).toUpperCase() + id.slice(1)}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'payment-history' && <PaymentHistorySettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'notifications' && (
            <p className="text-studio-text-secondary">
              {t('settingsNotificationsComingSoon')}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
