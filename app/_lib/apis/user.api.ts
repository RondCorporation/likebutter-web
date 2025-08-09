import { apiFetch, getAccessToken } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { User } from '@/stores/authStore';

export const getMe = (): Promise<ApiResponse<User>> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    return Promise.reject(new Error('Access token not found.'));
  }
  return apiFetch<User>('/users/me', { method: 'GET' }, true);
};
