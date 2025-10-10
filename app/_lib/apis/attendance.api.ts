import { apiClient } from '@/app/_lib/apiClient';
import {
  ApiResponse,
  AttendanceCheckResponse,
  TodayAttendanceStatus,
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
};
