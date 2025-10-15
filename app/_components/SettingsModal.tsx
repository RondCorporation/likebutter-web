'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { X, User, Settings as SettingsIcon } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';
import { useCredit } from '@/hooks/useCredit';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useScrollLock } from '@/hooks/useScrollLock';
import SubscriptionManager from './subscription/SubscriptionManager';

function AccountSettings() {
  const { user } = useAuthStore();
  const logout = useLogout();
  const { t } = useTranslation();
  const { currentBalance, isLoading: isCreditLoading } = useCredit();
  const { hasAttendedToday, isLoading: isAttendanceLoading } =
    useAttendanceStore();

  if (!user) {
    return <p className="text-studio-text-secondary">{t('settingsLoading')}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Account Information Section */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-3">
          {t('settingsAccountInfo')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountName')}
            </div>
            <div className="text-sm text-white font-medium">{user.name}</div>
          </div>
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountEmail')}
            </div>
            <div className="text-sm text-white/90">{user.email}</div>
          </div>
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountPhone')}
            </div>
            <div className="text-sm text-white/90">
              {user.phoneNumber || t('settingsNotProvided')}
            </div>
          </div>
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountJoinDate')}
            </div>
            <div className="text-sm text-white/90">
              {(user as any).createdAt
                ? new Date((user as any).createdAt).toLocaleDateString()
                : t('settingsNotProvided')}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Information Section */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-3">
          {t('settingsAccountStats')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountCredits')}
            </div>
            <div className="text-base font-semibold text-butter-yellow">
              {isCreditLoading ? '...' : currentBalance.toLocaleString()}
            </div>
          </div>
          <div className="px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1 tracking-wide">
              {t('settingsAccountAttendance')}
            </div>
            <div
              className={`text-sm font-medium ${hasAttendedToday ? 'text-green-400' : 'text-white/40'}`}
            >
              {isAttendanceLoading
                ? '...'
                : hasAttendedToday
                  ? t('settingsAttendanceCompleted')
                  : t('settingsAttendanceNotCompleted')}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Section */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-3">
          {t('settingsSubscriptionTitle')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm p-4">
          <SubscriptionManager />
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full bg-white/[0.03] hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-all rounded-md"
        >
          {t('dropdownLogout')}
        </button>
      </div>
    </div>
  );
}

function GeneralSettings() {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (newLang: string) => {
    const currentLang = i18n.language;
    if (newLang !== currentLang) {
      const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`);
      document.cookie = `i18next=${newLang};path=/;max-age=31536000`;
      router.push(newPath);
    }
    setIsLanguageOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  return (
    <div className="space-y-6">
      {/* Language Setting */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-3">
          {t('settingsLanguage')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm px-4 py-3">
          <div className="relative w-full max-w-xs" ref={dropdownRef}>
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="w-full bg-white/[0.04] text-white border border-white/10 rounded px-3 py-2.5 text-sm hover:bg-white/[0.06] focus:outline-none focus:border-butter-yellow transition-colors flex items-center justify-between gap-2"
            >
              <span>{currentLanguage?.name}</span>
              <svg
                className={`w-4 h-4 transition-transform flex-shrink-0 ${isLanguageOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isLanguageOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-md bg-studio-sidebar border border-studio-border shadow-lg py-1 z-[110]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-studio-button-primary/10 transition ${
                      i18n.language === lang.code
                        ? 'text-studio-button-primary font-medium'
                        : 'text-studio-text-primary'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-3">
          {t('settingsPreferences')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors opacity-60 cursor-not-allowed">
            <div>
              <div className="text-sm font-medium text-white mb-0.5">
                {t('settingsAutoSave')}
              </div>
              <div className="text-xs text-white/50">
                {t('settingsAutoSaveDesc')}
              </div>
            </div>
            <button
              disabled
              className="relative w-11 h-6 bg-butter-yellow cursor-not-allowed"
            >
              <span className="absolute top-1 left-1 w-4 h-4 bg-white translate-x-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsModal() {
  const { isSettingsOpen, closeSettings, initialSettingsTab } = useUIStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(() => {
    if (initialSettingsTab === 'subscription') return 'account';
    return initialSettingsTab || 'general';
  });

  useScrollLock(isSettingsOpen);

  useEffect(() => {
    if (isSettingsOpen && initialSettingsTab) {
      const tab =
        initialSettingsTab === 'subscription' ? 'account' : initialSettingsTab;
      setActiveTab(tab);
    } else if (isSettingsOpen) {
      setActiveTab('general');
    }
  }, [isSettingsOpen, initialSettingsTab]);

  const TABS = [
    { id: 'general', label: t('settingsTabGeneral'), icon: SettingsIcon },
    { id: 'account', label: t('settingsTabAccount'), icon: User },
  ];

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex w-full flex-col overflow-hidden bg-[#25282c] text-studio-text-primary shadow-2xl md:w-[700px] md:flex-row border border-white/10 rounded-2xl h-[85vh] max-h-[600px]">
        <button
          onClick={closeSettings}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-50 text-studio-text-secondary/60 hover:text-white transition-colors"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* Desktop Sidebar */}
        <aside className="hidden w-48 flex-shrink-0 border-r border-white/[0.06] bg-[#1e2124] p-6 pt-8 md:flex md:flex-col">
          <h2 className="mb-6 text-xs font-medium tracking-wider text-white/40 uppercase">
            {t('settingsTitle')}
          </h2>
          <div className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-all rounded-md ${
                  activeTab === id
                    ? 'bg-white/[0.06] text-white border-l-2 border-butter-yellow'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={16} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="border-b border-white/[0.06] bg-[#1e2124] p-4 pt-6 md:hidden">
          <h2 className="mb-4 text-center text-xs font-medium tracking-wider text-white/60 uppercase">
            {t('settingsTitle')}
          </h2>
          <div className="flex gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 text-xs font-medium transition-all rounded-md ${
                  activeTab === id
                    ? 'text-white bg-white/[0.06] border-b-2 border-butter-yellow'
                    : 'text-white/50'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 custom-scrollbar">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'account' && <AccountSettings />}
        </section>
      </div>
    </div>
  );
}
