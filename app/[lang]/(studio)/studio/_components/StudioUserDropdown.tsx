'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  User,
  Settings,
  LogOut,
  History,
  Crown,
  Globe,
  Calendar,
  Check,
  MessageCircle,
  Gift,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { useLogout } from '@/app/_hooks/useLogout';
import { useAuth } from '@/app/_hooks/useAuth';
import { useOpenSettings } from '@/app/_hooks/useUIStore';
import { useAttendanceStore } from '@/app/_stores/attendanceStore';
import { useCredit } from '@/app/_hooks/useCredit';
import { useSubscription } from '@/app/_hooks/useSubscription';
import FeedbackPopup from '@/app/_components/ui/FeedbackPopup';
import { toast } from 'react-hot-toast';

export default function StudioUserDropdown() {
  const { t } = useTranslation(['studio', 'common']);
  const { displayName, userEmail } = useAuth();
  const logout = useLogout();
  const openSettings = useOpenSettings();
  const {
    isLoading,
    hasAttendedToday,
    showAttendanceModal,
    fetchTodayStatus,
    isInitialized,
  } = useAttendanceStore();
  const { currentBalance, isLoading: isCreditLoading } = useCredit();
  const { planDisplayName } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const languages = [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
  ];

  const handleLanguageChange = (newLang: string) => {
    if (newLang !== lang) {
      const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
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
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  if (!displayName) return null;

  const handleAction = (action: () => void | Promise<void>) => {
    setIsOpen(false);
    setIsLanguageOpen(false);
    action();
  };

  const handleFreeCreditClick = async () => {
    if (isLoading) return;

    if (!isInitialized) {
      await fetchTodayStatus();
    }

    if (hasAttendedToday) {
      toast.error(t('studio:attendance.messages.alreadyChecked'));
    } else {
      showAttendanceModal();
    }
  };

  const handleFeedbackClick = () => {
    setIsFeedbackOpen(true);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-studio-header flex items-center justify-center hover:bg-gray-600 transition-colors border border-gray-600"
      >
        <User className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] md:w-72 rounded-lg bg-studio-sidebar border border-studio-border shadow-lg py-4 z-50 animate-fadeIn">
          {/* Profile Info Section */}
          <div className="px-4 pb-4">
            {/* Email */}
            <div className="text-studio-text-secondary text-xs mb-3">
              {userEmail}
            </div>

            {/* Profile Image + Name + Credits */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-studio-button-primary flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-studio-header" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-studio-text-primary text-sm font-semibold truncate">
                    {displayName}
                  </div>
                  <div className="text-studio-text-secondary text-xs truncate">
                    {planDisplayName}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Image
                    src="/credit.svg"
                    alt="credit"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span className="text-studio-text-primary text-sm font-semibold">
                    {isCreditLoading ? '...' : currentBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-studio-text-secondary text-xs text-right">
                  {t('studio:userDropdown.credits')}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-studio-border my-2" />

          {/* Language and Settings */}
          <div className="px-2">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex w-full items-center justify-between px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
              >
                <div className="flex items-center gap-3">
                  <Globe size={16} className="text-studio-text-secondary" />
                  {t('studio:userDropdown.languageSettings')}
                </div>
                <ChevronRight
                  size={14}
                  className={`text-studio-text-secondary transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-full top-0 mr-1 w-32 rounded-md bg-studio-sidebar border border-studio-border shadow-lg py-1 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-studio-button-primary/10 transition ${
                        lang === language.code
                          ? 'text-studio-button-primary font-medium'
                          : 'text-studio-text-primary'
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleAction(() => openSettings())}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Settings size={16} className="text-studio-text-secondary" />
              {t('studio:userDropdown.settings')}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-studio-border my-2" />

          {/* Credit and Payment Management */}
          <div className="px-2">
            <button
              onClick={() =>
                handleAction(() => router.push(`/${lang}/studio?tool=credits`))
              }
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Image
                src="/credit.svg"
                alt="credit"
                width={16}
                height={16}
                className="flex-shrink-0"
              />
              {t('studio:userDropdown.creditManagement')}
            </button>
            <button
              onClick={() =>
                handleAction(() => router.push(`/${lang}/billing`))
              }
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Crown size={16} className="text-studio-text-secondary" />
              {t('studio:userDropdown.upgradePlan')}
            </button>
            <button
              onClick={() => handleAction(handleFreeCreditClick)}
              disabled={hasAttendedToday || isLoading}
              className={`flex w-full items-center gap-3 px-2 py-2.5 text-sm rounded-md transition ${
                hasAttendedToday
                  ? 'text-studio-text-secondary cursor-not-allowed'
                  : 'text-studio-text-primary hover:bg-studio-button-primary/10'
              }`}
            >
              {hasAttendedToday ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Gift size={16} className="text-studio-text-secondary" />
              )}
              {isLoading
                ? t('studio:userDropdown.receivingCredits')
                : hasAttendedToday
                  ? t('studio:userDropdown.alreadyReceived')
                  : t('studio:userDropdown.getFreeCredits')}
            </button>
            <button
              onClick={() => handleAction(handleFeedbackClick)}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <MessageCircle size={16} className="text-studio-text-secondary" />
              {t('studio:userDropdown.feedback')}
            </button>
          </div>

          {/* Divider */}
          <hr className="border-studio-border my-2" />

          {/* Logout */}
          <div className="px-2">
            <button
              onClick={() => handleAction(logout)}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-red-400 hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <LogOut size={16} />
              {t('studio:userDropdown.logout')}
            </button>
          </div>
        </div>
      )}

      {/* Feedback Popup */}
      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
