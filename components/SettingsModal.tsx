'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import LanguageSwitcher from './LanguageSwitcher';
import { useLang } from '@/hooks/useLang';

const TAB_IDS = ['general', 'notifications', 'account', 'subscription'] as const;

function AccountSettings() {
  const { user } = useAuthStore();
  const logout = useLogout();

  if (!user) {
    return <p className="text-slate-400">Loading user data...</p>;
  }

  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold">Account Information</h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">Email:</span>
          <span>{user.email}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">Name:</span>
          <span>{user.name}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">Gender:</span>
          <span className="capitalize">{user.gender.toLowerCase()}</span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">Country:</span>
          <span>
            {user.countryName} ({user.countryCode})
          </span>
        </div>
        <div className="flex justify-between items-center p-4 bg-white/5 rounded-md">
          <span className="text-slate-400">Phone:</span>
          <span>{user.phoneNumber || 'Not provided'}</span>
        </div>
      </div>
      <button
        onClick={logout}
        className="mt-10 w-full rounded-md bg-red-600/80 py-2.5 text-sm font-medium text-white hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default function SettingsModal() {
  const { isSettingsOpen, closeSettings } = useUIStore();
  const [activeTab, setActiveTab] = useState('account');
  const router = useRouter();
  const { t } = useLang();
  const TABS = TAB_IDS.map((id) => ({
    id,
    label: t[id as keyof typeof t],
    icon: id === 'general'
      ? SettingsIcon
      : id === 'notifications'
      ? Bell
      : id === 'account'
      ? User
      : CreditCard,
  }));

  if (!isSettingsOpen) return null;

  const goToPricing = () => {
    closeSettings();
    router.push('/pricing');
  };

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
          <h2 className="text-lg font-semibold mb-6 px-3">{t.settings}</h2>
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
          {activeTab === 'general' && (
            <div className="space-y-4 text-sm">
              <label className="block text-slate-400">{t.selectLang}</label>
              <LanguageSwitcher />
            </div>
          )}
          {activeTab === 'notifications' && (
            <p className="text-slate-400">Notification settings coming soon.</p>
          )}
          {activeTab === 'subscription' && (
            <div>
              <h3 className="mb-6 text-xl font-semibold">Subscription</h3>
              <p className="text-slate-400">
                Subscription management coming soon.
              </p>
              <button
                onClick={goToPricing}
                className="mt-4 text-accent underline hover:text-yellow-300"
              >
                View Plans
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
