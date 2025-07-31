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
} from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';
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
      <h3 className="mb-4 text-lg font-semibold md:mb-6 md:text-xl">
        {t('settingsAccountInfo')}
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <span className="text-slate-400">{t('settingsAccountEmail')}</span>
          <span className="font-medium">{user.email}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <span className="text-slate-400">{t('settingsAccountName')}</span>
          <span className="font-medium">{user.name}</span>
        </div>
        <div className="flex flex-col gap-1 rounded-md bg-white/5 p-3 md:flex-row md:items-center md:justify-between md:p-4">
          <span className="text-slate-400">{t('settingsAccountPhone')}</span>
          <span className="font-medium">
            {user.phoneNumber || t('settingsNotProvided')}
          </span>
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
          className="mb-2 block text-sm text-slate-400"
        >
          {t('settingsLanguage')}
        </label>
        <div className="relative w-full max-w-xs">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-labelledby="language-dropdown-label"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white transition hover:bg-white/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <span>{currentLanguageName}</span>
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <ul
              className="absolute z-10 mt-1 w-full rounded-md border border-white/10 bg-slate-900 py-1 shadow-lg"
              role="listbox"
            >
              {languages.map((lang) => (
                <li
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex cursor-pointer items-center px-3 py-2 text-sm text-white hover:bg-accent hover:text-black"
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
    { id: 'general', label: t('settingsTabGeneral'), icon: SettingsIcon },
    { id: 'notifications', label: t('settingsTabNotifications'), icon: Bell },
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm md:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-none border border-white/10 bg-black text-white shadow-2xl md:h-[70vh] md:max-w-4xl md:flex-row md:rounded-lg">
        <button
          onClick={closeSettings}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Desktop Sidebar */}
        <aside className="hidden w-56 flex-shrink-0 space-y-1 border-r border-white/10 p-6 pt-8 md:flex md:flex-col">
          <h2 className="mb-6 px-3 text-lg font-semibold">
            {t('settingsTitle')}
          </h2>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition hover:bg-white/10 ${
                activeTab === id
                  ? 'bg-white/10 font-medium text-accent'
                  : 'text-slate-300'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </aside>

        {/* Mobile Tabs */}
        <div className="border-b border-white/10 p-4 pt-6 md:hidden">
          <h2 className="mb-4 text-center text-lg font-semibold">
            {t('settingsTitle')}
          </h2>
          <div className="flex justify-around">
            {TABS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex flex-col items-center gap-1 p-2 text-xs ${
                  activeTab === id ? 'text-accent' : 'text-slate-400'
                }`}
              >
                <Icon size={20} />
                <span>{t(`settingsTab${id.charAt(0).toUpperCase() + id.slice(1)}`)}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'subscription' && <SubscriptionSettings />}
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'notifications' && (
            <p className="text-slate-400">
              {t('settingsNotificationsComingSoon')}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
