'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  X,
  User,
  Bell,
  Settings as SettingsIcon,
  CreditCard,
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';
import { cancelSubscription } from '@/lib/api';
import SubscriptionManager from './subscription/SubscriptionManager';

function AccountSettings() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const { t } = useTranslation();

  if (!user) {
    return <p className="text-slate-400">{t('settingsLoading')}</p>;
  }

  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold">{t('settingsAccountInfo')}</h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">{t('settingsAccountEmail')}</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">{t('settingsAccountName')}</span>
          <span>{user.name}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">{t('settingsAccountPhone')}</span>
          <span>{user.phoneNumber || t('settingsNotProvided')}</span>
        </div>
      </div>
      <button
        onClick={logout}
        className="mt-10 w-full rounded-md bg-red-600/80 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition"
      >
        {t('dropdownLogout')}
      </button>
    </div>
  );
}

function SubscriptionSettings() {
  return <SubscriptionManager />;
}

export default function SettingsModal() {
  const { isSettingsOpen, closeSettings } = useUIStore();
  const [activeTab, setActiveTab] = useState('account');
  const { t } = useTranslation();

  const TABS = [
    { id: 'account', label: t('settingsTabAccount'), icon: User },
    { id: 'subscription', label: t('settingsTabSubscription'), icon: CreditCard },
    { id: 'general', label: t('settingsTabGeneral'), icon: SettingsIcon },
    { id: 'notifications', label: t('settingsTabNotifications'), icon: Bell },
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-4xl h-[70vh] rounded-lg bg-black border border-white/10 text-white overflow-hidden shadow-2xl">
        <button
          onClick={closeSettings}
          className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
        >
          <X size={20} />
        </button>

        <aside className="w-56 border-r border-white/10 p-6 pt-8 space-y-1 flex-shrink-0">
          <h2 className="text-lg font-semibold mb-6 px-3">{t('settingsTitle')}</h2>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-white/10 ${
                activeTab === id
                  ? 'bg-white/10 text-accent font-medium'
                  : 'text-slate-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        <section className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'general' && (
            <p className="text-slate-400">{t('settingsGeneralComingSoon')}</p>
          )}
          {activeTab === 'notifications' && (
            <p className="text-slate-400">{t('settingsNotificationsComingSoon')}</p>
          )}
        </section>
      </div>
    </div>
  );
}
