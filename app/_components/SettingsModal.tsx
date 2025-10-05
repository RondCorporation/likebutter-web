'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { X, User, Settings as SettingsIcon } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/hooks/useLogout';
import { useCredit } from '@/hooks/useCredit';
import { useAttendanceStore } from '@/stores/attendanceStore';
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
    <div className="space-y-8">
      {/* Account Information Section */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-4">
          {t('settingsAccountInfo')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountName')}
            </div>
            <div className="text-base text-white font-medium">{user.name}</div>
          </div>
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountEmail')}
            </div>
            <div className="text-base text-white/90">{user.email}</div>
          </div>
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountPhone')}
            </div>
            <div className="text-base text-white/90">
              {user.phoneNumber || t('settingsNotProvided')}
            </div>
          </div>
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountJoinDate')}
            </div>
            <div className="text-base text-white/90">
              {(user as any).createdAt
                ? new Date((user as any).createdAt).toLocaleDateString()
                : t('settingsNotProvided')}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Information Section */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-4">
          {t('settingsAccountStats')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountCredits')}
            </div>
            <div className="text-lg font-semibold text-butter-yellow">
              {isCreditLoading ? '...' : currentBalance.toLocaleString()}
            </div>
          </div>
          <div className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
            <div className="text-xs text-studio-text-secondary/80 mb-1.5 tracking-wide">
              {t('settingsAccountAttendance')}
            </div>
            <div
              className={`text-base font-medium ${hasAttendedToday ? 'text-green-400' : 'text-white/40'}`}
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
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-4">
          {t('settingsSubscriptionTitle')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm p-5">
          <SubscriptionManager />
        </div>
      </div>

      {/* Logout */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full bg-white/[0.03] hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 py-3.5 text-sm font-medium text-red-400 hover:text-red-300 transition-all"
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
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleLanguageChange = (newLang: string) => {
    const currentLang = i18n.language;
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

  return (
    <div className="space-y-8">
      {/* Language Setting */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-4">
          {t('settingsLanguage')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-5 py-4 text-left transition-colors ${
                i18n.language === lang.code
                  ? 'bg-white/[0.04] text-white border-l-2 border-butter-yellow'
                  : 'text-white/70 hover:bg-white/[0.02] hover:text-white'
              }`}
            >
              <span className="text-sm font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-xs font-medium tracking-wider text-studio-text-secondary/60 uppercase mb-4">
          {t('settingsPreferences')}
        </h3>
        <div className="bg-white/[0.02] backdrop-blur-sm space-y-px">
          <div className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div>
              <div className="text-sm font-medium text-white mb-0.5">
                {t('settingsAutoSave')}
              </div>
              <div className="text-xs text-white/50">
                {t('settingsAutoSaveDesc')}
              </div>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`relative w-11 h-6 transition-colors ${
                autoSave ? 'bg-butter-yellow' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white transition-transform ${
                  autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
            <div>
              <div className="text-sm font-medium text-white mb-0.5">
                {t('settingsNotifications')}
              </div>
              <div className="text-xs text-white/50">
                {t('settingsNotificationsDesc')}
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 transition-colors ${
                notifications ? 'bg-butter-yellow' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-0 backdrop-blur-md md:p-4">
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0f1114] text-studio-text-primary shadow-2xl md:h-[75vh] md:max-w-5xl md:flex-row border border-white/[0.08]">
        <button
          onClick={closeSettings}
          className="absolute top-5 right-5 z-50 text-studio-text-secondary/60 hover:text-white transition-colors"
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-white/[0.06] bg-[#0a0c0e] p-8 pt-10 md:flex md:flex-col">
          <h2 className="mb-8 text-sm font-medium tracking-wider text-white/40 uppercase">
            {t('settingsTitle')}
          </h2>
          <div className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-white/[0.06] text-white border-l-2 border-butter-yellow'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="border-b border-white/[0.06] bg-[#0a0c0e] p-5 pt-7 md:hidden">
          <h2 className="mb-5 text-center text-sm font-medium tracking-wider text-white/60 uppercase">
            {t('settingsTitle')}
          </h2>
          <div className="flex gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 text-xs font-medium transition-all ${
                  activeTab === id
                    ? 'text-white bg-white/[0.06] border-b-2 border-butter-yellow'
                    : 'text-white/50'
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <section className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'account' && <AccountSettings />}
        </section>
      </div>
    </div>
  );
}
