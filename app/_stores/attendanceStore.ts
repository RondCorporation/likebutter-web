import { create } from 'zustand';
import { attendanceApi } from '@/app/_lib/apis/attendance.api';
import {
  AttendanceCheckResponse,
  TodayAttendanceStatus,
} from '@/app/_types/api';
import { toast } from 'react-hot-toast';
import i18n from '@/app/_lib/i18n-client';

interface AttendanceState {
  isLoading: boolean;
  todayStatus: TodayAttendanceStatus | null;
  isLoadingStatus: boolean;
  shouldShowModal: boolean;
  isInitialized: boolean;

  hasAttendedToday: boolean;

  checkAttendance: () => Promise<AttendanceCheckResponse | null>;
  fetchTodayStatus: (showLoading?: boolean) => Promise<void>;
  checkAttendanceOnStudioMount: () => Promise<void>;
  checkAttendanceFromModal: () => Promise<boolean>;
  closeModal: () => void;
  showAttendanceModal: () => void;
}

// 한국 시간(KST) 기준으로 현재 날짜를 YYYY-MM-DD 형식으로 반환
const getKSTDateString = (): string => {
  const now = new Date();
  const kstOffset = 9 * 60; // KST는 UTC+9
  const kstTime = new Date(now.getTime() + kstOffset * 60 * 1000);

  const year = kstTime.getUTCFullYear();
  const month = String(kstTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kstTime.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const checkModalShownToday = (): boolean => {
  const todayKST = getKSTDateString();
  const modalData = localStorage.getItem('attendanceModalShown');

  if (!modalData) return false;

  try {
    const parsed = JSON.parse(modalData);
    return parsed.date === todayKST;
  } catch {
    localStorage.removeItem('attendanceModalShown');
    return false;
  }
};

const setModalShownToday = () => {
  const todayKST = getKSTDateString();
  localStorage.setItem(
    'attendanceModalShown',
    JSON.stringify({ date: todayKST })
  );
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  isLoading: false,
  todayStatus: null,
  isLoadingStatus: false,
  shouldShowModal: false,
  isInitialized: false,
  hasAttendedToday: false,

  checkAttendance: async (): Promise<AttendanceCheckResponse | null> => {
    try {
      set({ isLoading: true });
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(
          i18n.t('studio:attendance.messages.success', {
            credit: response.data.creditGranted,
          })
        );

        get().fetchTodayStatus(false);

        window.dispatchEvent(new CustomEvent('credit-updated'));

        return response.data;
      }
      return null;
    } catch (error: any) {
      if (error.message === 'ALREADY_CHECKED_ATTENDANCE') {
        toast.error(i18n.t('studio:attendance.messages.alreadyChecked'));
      } else {
        toast.error(i18n.t('studio:attendance.messages.error'));
      }
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTodayStatus: async (showLoading = true) => {
    try {
      if (showLoading) set({ isLoadingStatus: true });
      const response = await attendanceApi.getTodayStatus();
      if (response.data) {
        set({
          todayStatus: response.data,
          isInitialized: true,
          hasAttendedToday: response.data.hasCheckedToday || false,
        });
      }
    } catch (error) {
      console.error('Failed to fetch today attendance status:', error);
    } finally {
      if (showLoading) set({ isLoadingStatus: false });
    }
  },

  checkAttendanceOnStudioMount: async () => {
    const { isInitialized, todayStatus } = get();

    if (isInitialized) {
      if (todayStatus && !todayStatus.hasCheckedToday) {
        const modalShownToday = checkModalShownToday();
        if (!modalShownToday) {
          set({ shouldShowModal: true });
        }
      }
      return;
    }

    try {
      set({ isLoadingStatus: true });
      const response = await attendanceApi.getTodayStatus();
      if (response.data) {
        set({
          todayStatus: response.data,
          isInitialized: true,
          hasAttendedToday: response.data.hasCheckedToday || false,
        });

        if (!response.data.hasCheckedToday) {
          const modalShownToday = checkModalShownToday();
          if (!modalShownToday) {
            set({ shouldShowModal: true });
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch today attendance status:', error);
    } finally {
      set({ isLoadingStatus: false });
    }
  },

  checkAttendanceFromModal: async (): Promise<boolean> => {
    try {
      set({ isLoading: true });
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(
          i18n.t('studio:attendance.messages.success', {
            credit: response.data.creditGranted,
          })
        );

        const { todayStatus } = get();
        set({
          todayStatus: todayStatus
            ? {
                ...todayStatus,
                hasCheckedToday: true,
                consecutiveDays: todayStatus.consecutiveDays + 1,
              }
            : null,
          shouldShowModal: false,
          hasAttendedToday: true,
        });

        setModalShownToday();

        window.dispatchEvent(new CustomEvent('credit-updated'));

        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === 'ALREADY_CHECKED_ATTENDANCE') {
        toast.error(i18n.t('studio:attendance.messages.alreadyChecked'));
        set({ shouldShowModal: false });
        setModalShownToday();
      } else {
        toast.error(i18n.t('studio:attendance.messages.error'));
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  closeModal: () => {
    set({ shouldShowModal: false });
    setModalShownToday();
  },

  showAttendanceModal: () => {
    set({ shouldShowModal: true });
  },
}));
