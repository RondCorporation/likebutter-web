'use client';

import { useState } from 'react';
import { attendanceApi } from '@/app/_lib/apis/attendance.api';
import { AttendanceCheckResponse, TodayAttendanceStatus } from '@/app/_types/api';
import { toast } from 'react-hot-toast';

export function useAttendance() {
  const [isLoading, setIsLoading] = useState(false);
  const [todayStatus, setTodayStatus] = useState<TodayAttendanceStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkAttendance = async (): Promise<AttendanceCheckResponse | null> => {
    try {
      setIsLoading(true);
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(`출석체크 완료! ${response.data.creditGranted} 크레딧을 획득했습니다.`);

        // 출석체크 후 오늘 상태 업데이트 (로딩 없이)
        fetchTodayStatus(false);

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
      setIsLoading(false);
    }
  };

  const fetchTodayStatus = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoadingStatus(true);
      const response = await attendanceApi.getTodayStatus();
      if (response.data) {
        setTodayStatus(response.data);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to fetch today attendance status:', error);
    } finally {
      if (showLoading) setIsLoadingStatus(false);
    }
  };

  // Studio 접속 시 출석 상태 확인 및 모달 표시 여부 결정
  const checkAttendanceOnStudioMount = async () => {
    // 이미 초기화되었으면 중복 호출 방지
    if (isInitialized) {
      // 이미 데이터가 있으면 모달 표시 로직만 실행
      if (todayStatus && !todayStatus.hasAttended) {
        const modalShownToday = sessionStorage.getItem('attendanceModalShown');
        if (!modalShownToday) {
          setShouldShowModal(true);
        }
      }
      return;
    }

    try {
      setIsLoadingStatus(true);
      const response = await attendanceApi.getTodayStatus();
      if (response.data) {
        setTodayStatus(response.data);
        setIsInitialized(true);

        // 오늘 출석하지 않았고, 세션에서 이미 모달을 보여주지 않았다면 모달 표시
        if (!response.data.hasAttended) {
          const modalShownToday = sessionStorage.getItem('attendanceModalShown');
          if (!modalShownToday) {
            setShouldShowModal(true);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch today attendance status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  // 모달에서 출석체크 수행
  const checkAttendanceFromModal = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await attendanceApi.checkAttendance();

      if (response.data) {
        toast.success(`출석체크 완료! ${response.data.creditGranted} 크레딧을 획득했습니다.`);

        // 출석체크 후 상태 업데이트
        setTodayStatus(prev => prev ? { ...prev, hasAttended: true, creditGranted: response.data?.creditGranted ?? null } : null);

        // 모달 닫기 및 세션 저장
        setShouldShowModal(false);
        sessionStorage.setItem('attendanceModalShown', 'true');

        // 크레딧 잔액도 업데이트하기 위한 이벤트 발생
        window.dispatchEvent(new CustomEvent('credit-updated'));

        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === 'ALREADY_CHECKED_ATTENDANCE') {
        toast.error('이미 오늘 출석체크를 완료했습니다.');
        setShouldShowModal(false);
        sessionStorage.setItem('attendanceModalShown', 'true');
      } else {
        toast.error('출석체크에 실패했습니다. 다시 시도해주세요.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setShouldShowModal(false);
    sessionStorage.setItem('attendanceModalShown', 'true');
  };

  // useEffect에서 자동 호출 제거 - StudioRouter에서 필요할 때만 호출

  return {
    checkAttendance,
    isLoading,
    todayStatus,
    isLoadingStatus,
    hasAttendedToday: todayStatus?.hasAttended || false,
    shouldShowModal,
    checkAttendanceOnStudioMount,
    checkAttendanceFromModal,
    closeModal,
  };
}