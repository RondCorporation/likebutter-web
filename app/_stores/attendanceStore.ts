import { create } from 'zustand';
import { attendanceApi } from '@/app/_lib/apis/attendance.api';
import { AttendanceCheckResponse, TodayAttendanceStatus } from '@/app/_types/api';
import { toast } from 'react-hot-toast';

interface AttendanceState {
  // 상태
  isLoading: boolean;
  todayStatus: TodayAttendanceStatus | null;
  isLoadingStatus: boolean;
  shouldShowModal: boolean;
  isInitialized: boolean;

  // 계산된 값
  hasAttendedToday: boolean;

  // 액션
  checkAttendance: () => Promise<AttendanceCheckResponse | null>;
  fetchTodayStatus: (showLoading?: boolean) => Promise<void>;
  checkAttendanceOnStudioMount: () => Promise<void>;
  checkAttendanceFromModal: () => Promise<boolean>;
  closeModal: () => void;
  showAttendanceModal: () => void;
}

// 세션 스토리지에서 모달 표시 여부 확인 (날짜 기반)
const checkModalShownToday = (): boolean => {
  const today = new Date().toDateString();
  const modalData = sessionStorage.getItem('attendanceModalShown');

  if (!modalData) return false;

  try {
    const parsed = JSON.parse(modalData);
    return parsed.date === today;
  } catch {
    // 기존 형식(단순 문자열)인 경우 제거하고 false 반환
    sessionStorage.removeItem('attendanceModalShown');
    return false;
  }
};

// 세션 스토리지에 모달 표시 여부 저장 (날짜 기반)
const setModalShownToday = () => {
  const today = new Date().toDateString();
  sessionStorage.setItem('attendanceModalShown', JSON.stringify({ date: today }));
};

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  // 초기 상태
  isLoading: false,
  todayStatus: null,
  isLoadingStatus: false,
  shouldShowModal: false,
  isInitialized: false,
  hasAttendedToday: false,

  // 출석체크 실행
  checkAttendance: async (): Promise<AttendanceCheckResponse | null> => {
    try {
      set({ isLoading: true });
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(`출석체크 완료! ${response.data.creditGranted} 크레딧을 획득했습니다.`);

        // 출석체크 후 오늘 상태 업데이트 (로딩 없이)
        get().fetchTodayStatus(false);

        // 크레딧 잔액도 업데이트하기 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('credit-updated'));

        return response.data;
      }
      return null;
    } catch (error: any) {
      if (error.message === 'ALREADY_CHECKED_ATTENDANCE') {
        toast.error('이미 오늘 출석체크를 완료했습니다.');
      } else {
        toast.error('출석체크에 실패했습니다. 다시 시도해주세요.');
      }
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // 오늘 출석 상태 조회
  fetchTodayStatus: async (showLoading = true) => {
    try {
      if (showLoading) set({ isLoadingStatus: true });
      const response = await attendanceApi.getTodayStatus();
      if (response.data) {
        set({
          todayStatus: response.data,
          isInitialized: true,
          hasAttendedToday: response.data.hasAttended || false
        });
      }
    } catch (error) {
      console.error('Failed to fetch today attendance status:', error);
    } finally {
      if (showLoading) set({ isLoadingStatus: false });
    }
  },

  // Studio 접속 시 출석 상태 확인 및 모달 표시 여부 결정
  checkAttendanceOnStudioMount: async () => {
    const { isInitialized, todayStatus } = get();

    // 이미 초기화되었으면 중복 호출 방지
    if (isInitialized) {
      // 이미 데이터가 있으면 모달 표시 로직만 실행
      if (todayStatus && !todayStatus.hasAttended) {
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
          hasAttendedToday: response.data.hasAttended || false
        });

        // 오늘 출석하지 않았고, 세션에서 이미 모달을 보여주지 않았다면 모달 표시
        if (!response.data.hasAttended) {
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

  // 모달에서 출석체크 수행
  checkAttendanceFromModal: async (): Promise<boolean> => {
    try {
      set({ isLoading: true });
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(`출석체크 완료! ${response.data.creditGranted} 크레딧을 획득했습니다.`);

        // 출석체크 후 상태 업데이트
        const { todayStatus } = get();
        set({
          todayStatus: todayStatus ? {
            ...todayStatus,
            hasAttended: true,
            creditGranted: response.data?.creditGranted ?? null
          } : null,
          shouldShowModal: false,
          hasAttendedToday: true
        });

        // 모달 닫기 및 세션 저장
        setModalShownToday();

        // 크레딧 잔액도 업데이트하기 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('credit-updated'));

        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === 'ALREADY_CHECKED_ATTENDANCE') {
        toast.error('이미 오늘 출석체크를 완료했습니다.');
        set({ shouldShowModal: false });
        setModalShownToday();
      } else {
        toast.error('출석체크에 실패했습니다. 다시 시도해주세요.');
      }
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // 모달 닫기
  closeModal: () => {
    set({ shouldShowModal: false });
    setModalShownToday();
  },

  // 수동으로 모달 표시 (무료 크레딧 얻기 버튼용)
  showAttendanceModal: () => {
    set({ shouldShowModal: true });
  },
}));