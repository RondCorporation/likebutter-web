import { apiClient } from '@/app/_lib/apiClient';
import {
  ApiResponse,
  AttendanceCheckResponse,
  TodayAttendanceStatus,
  AttendanceSummary,
} from '@/app/_types/api';

let lastTodayStatusCall: Promise<ApiResponse<TodayAttendanceStatus>> | null =
  null;
let lastTodayStatusTime = 0;
const CACHE_DURATION = 5000;

export const attendanceApi = {
  checkAttendance: async (): Promise<ApiResponse<AttendanceCheckResponse>> => {
    return apiClient.post('/api/v1/attendance/check');
  },

  getTodayStatus: async (): Promise<ApiResponse<TodayAttendanceStatus>> => {
    const now = Date.now();

    if (lastTodayStatusCall && now - lastTodayStatusTime < CACHE_DURATION) {
      console.log('Returning cached attendance status request');
      return lastTodayStatusCall;
    }

    lastTodayStatusTime = now;
    lastTodayStatusCall = apiClient.get('/api/v1/attendance/status/today');

    try {
      const result = await lastTodayStatusCall;

      setTimeout(() => {
        lastTodayStatusCall = null;
      }, CACHE_DURATION);
      return result;
    } catch (error) {
      lastTodayStatusCall = null;
      throw error;
    }
  },

  // 미사용: 월별 출석 요약 조회 (향후 출석 캘린더 기능용)
  getSummary: async (
    month?: string
  ): Promise<ApiResponse<AttendanceSummary>> => {
    const params = month ? `?month=${month}` : '';
    return apiClient.get(`/api/v1/attendance/summary${params}`);
  },

  // 미사용: 연속 출석 일수 조회 (향후 통계 기능용)
  getConsecutiveDays: async (): Promise<ApiResponse<number>> => {
    return apiClient.get('/api/v1/attendance/consecutive');
  },
};
