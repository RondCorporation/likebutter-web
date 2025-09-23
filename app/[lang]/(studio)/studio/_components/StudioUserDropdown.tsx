'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
} from 'lucide-react';
import Image from 'next/image';
import { useLogout } from '@/app/_hooks/useLogout';
import { useAuth } from '@/app/_hooks/useAuth';
import { useOpenSettings } from '@/app/_hooks/useUIStore';
import { useAttendanceStore } from '@/app/_stores/attendanceStore';
import { useCredit } from '@/app/_hooks/useCredit';
import FeedbackPopup from '@/app/_components/ui/FeedbackPopup';
import { toast } from 'react-hot-toast';

export default function StudioUserDropdown() {
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const lang = pathname.split('/')[1];

  const planName = 'Basic Plan';

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
    action();
  };

  const handleFreeCreditClick = async () => {
    if (isLoading) return;

    if (!isInitialized) {
      await fetchTodayStatus();
    }

    if (hasAttendedToday) {
      toast.error('이미 오늘 출석체크를 완료했습니다.');
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
          {/* 프로필 정보 섹션 */}
          <div className="px-4 pb-4">
            {/* 이메일 */}
            <div className="text-studio-text-secondary text-xs mb-3">
              {userEmail}
            </div>

            {/* 프로필 이미지 + 이름 + 크레딧 */}
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
                    {planName}
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
                  크레딧
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <hr className="border-studio-border my-2" />

          {/* 언어 및 설정 */}
          <div className="px-2">
            <button
              onClick={() => handleAction(() => {})}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Globe size={16} className="text-studio-text-secondary" />
              언어 설정
            </button>
            <button
              onClick={() => handleAction(() => openSettings())}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Settings size={16} className="text-studio-text-secondary" />
              설정
            </button>
          </div>

          {/* 구분선 */}
          <hr className="border-studio-border my-2" />

          {/* 크레딧 및 결제 관리 */}
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
              크레딧 관리
            </button>
            <button
              onClick={() =>
                handleAction(() => router.push(`/${lang}/billing`))
              }
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <Crown size={16} className="text-studio-text-secondary" />
              요금제 업그레이드
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
                ? '크레딧 받는 중...'
                : hasAttendedToday
                  ? '오늘 크레딧 받음'
                  : '무료 크레딧 얻기'}
            </button>
            <button
              onClick={() => handleAction(handleFeedbackClick)}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-studio-text-primary hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <MessageCircle size={16} className="text-studio-text-secondary" />
              피드백
            </button>
          </div>

          {/* 구분선 */}
          <hr className="border-studio-border my-2" />

          {/* 로그아웃 */}
          <div className="px-2">
            <button
              onClick={() => handleAction(logout)}
              className="flex w-full items-center gap-3 px-2 py-2.5 text-sm text-red-400 hover:bg-studio-button-primary/10 rounded-md transition"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 피드백 팝업 */}
      <FeedbackPopup
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}
