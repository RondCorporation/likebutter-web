import { apiFetch } from '../apiClient';
import { ApiResponse } from '@/app/_types/api';
import { User } from '@/stores/authStore';

export const getMe = (): Promise<ApiResponse<User>> => {
  return apiFetch<User>('/users/me', { method: 'GET' }, true);
};
