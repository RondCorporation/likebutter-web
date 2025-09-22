import { apiClient } from '@/app/_lib/apiClient';
import { ApiResponse, AttendanceCheckResponse, TodayAttendanceStatus } from '@/app/_types/api';

// 중복 요청 방지를 위한 캐시
let lastTodayStatusCall: Promise<ApiResponse<TodayAttendanceStatus>> | null = null;
let lastTodayStatusTime = 0;
const CACHE_DURATION = 5000; // 5초 캐시

export const attendanceApi = {
  checkAttendance: async (): Promise<ApiResponse<AttendanceCheckResponse>> => {
    return apiClient.post('/attendance/check');
  },

  getTodayStatus: async (): Promise<ApiResponse<TodayAttendanceStatus>> => {
    const now = Date.now();

    // 5초 이내 중복 요청이면 진행 중인 요청 반환
    if (lastTodayStatusCall && (now - lastTodayStatusTime) < CACHE_DURATION) {
      console.log('Returning cached attendance status request');
      return lastTodayStatusCall;
    }

    // 새로운 요청 생성
    lastTodayStatusTime = now;
    lastTodayStatusCall = apiClient.get('/attendance/status/today');

    try {
      const result = await lastTodayStatusCall;
      // 성공적으로 완료되면 캐시 정리
      setTimeout(() => {
        lastTodayStatusCall = null;
      }, CACHE_DURATION);
      return result;
    } catch (error) {
      // 에러 발생 시 캐시 즉시 정리
      lastTodayStatusCall = null;
      throw error;
    }
  },
};